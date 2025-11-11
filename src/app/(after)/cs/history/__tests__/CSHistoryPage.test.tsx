import React from 'react'
// JSDOM doesn't provide IntersectionObserver; mock it for tests that render the page
class MockIntersectionObserver {
  callback: any
  constructor(cb: any) {
    this.callback = cb
  }
  // When observe is called in tests, immediately invoke the callback with
  // an intersecting entry. Individual tests control whether fetchNextPage
  // actually runs by setting hasNextPage / isFetchingNextPage on the mocked hook.
  observe = jest.fn(() => {
    try {
      this.callback([{ isIntersecting: true }])
    } catch (e) {
      // swallow to avoid throwing during tests that don't set a callback
    }
  })
  unobserve = jest.fn()
  disconnect = jest.fn()
}
// @ts-ignore - assign to global
global.IntersectionObserver = MockIntersectionObserver as any
import { render, screen, fireEvent } from '@testing-library/react'
import * as api from '@/api'
import { CSCategory } from '@/api/types/common'
import { mapCS } from '@/lib/mapEnum'

// Mock the API hook used by the page
jest.mock('@/api', () => ({
  useInfiniteQuestions: jest.fn(),
}))

// Mock child components to keep tests focused on the page behaviour
jest.mock('@/components/CS/History', () => ({
  CSHistory: ({ data }: any) => (
    <div data-testid="mock-cs-history">Mock CSHistory</div>
  ),
}))

jest.mock('@/components/Skeleton/CSHistorySkeleton', () => ({
  CSHistorySkeleton: () => (
    <div data-testid="mock-cs-history-skeleton">MockSkeleton</div>
  ),
}))

import Page from '@/app/(after)/cs/history/page'

describe('CS history page', () => {
  const useInfiniteQuestions = api.useInfiniteQuestions as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows skeleton when loading', () => {
    useInfiniteQuestions.mockReturnValue({
      data: undefined,
      isLoading: true,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    })

    const { container } = render(<Page />)
    expect(screen.getByTestId('mock-cs-history-skeleton')).toBeInTheDocument()
    // ensure full page title exists
    expect(screen.getByText(/날짜별 질문 내역/)).toBeInTheDocument()
    // spinner/skeleton presence confirmed by mocked skeleton
    expect(
      container.querySelector('[data-testid="mock-cs-history-skeleton"]'),
    ).toBeTruthy()
  })

  it('renders CSHistory when data is available', () => {
    useInfiniteQuestions.mockReturnValue({
      data: { pages: [{ result: { items: [] } }], pageParams: [] },
      isLoading: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    })

    render(<Page />)

    expect(screen.getByTestId('mock-cs-history')).toBeInTheDocument()
    expect(
      screen.queryByTestId('mock-cs-history-skeleton'),
    ).not.toBeInTheDocument()
  })

  it('category buttons toggle active state when clicked', () => {
    // Provide a mock implementation that returns the same shape regardless of category
    useInfiniteQuestions.mockImplementation((category: any) => ({
      data: { pages: [{ result: { items: [], csCategory: category } }] },
      isLoading: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    }))

    render(<Page />)

    // The "전체" button should be active initially (selectedCategory === null)
    const allButton = screen.getByText(/전체/)
    expect(allButton).toBeInTheDocument()
    expect(allButton.className).toMatch(/bg-blue-100/)

    // Click one of the category buttons and verify it becomes active
    const categories = Object.values(CSCategory)
    const firstCategory = categories[0]
    const firstCategoryLabel = mapCS(firstCategory as any)

    // getByText can fail if the label contains line breaks — match by normalized text
    const categoryButton = screen
      .getAllByRole('button')
      .find(
        (b) =>
          (b.textContent || '').replace(/\s+/g, ' ').trim() ===
          firstCategoryLabel.replace(/\s+/g, ' ').trim(),
      )

    expect(categoryButton).toBeDefined()
    fireEvent.click(categoryButton!)

    // After click, the clicked button should have the active class
    expect(categoryButton!.className).toMatch(/bg-blue-100/)
    // The hook should have been called initially with null (전체)
    expect(useInfiniteQuestions).toHaveBeenCalled()
    const firstCallArg = useInfiniteQuestions.mock.calls[0][0]
    expect(firstCallArg).toBeNull()

    // After clicking a category, the hook should be called again with that category
    const calls = useInfiniteQuestions.mock.calls
    const lastCallArg = calls[calls.length - 1][0]
    expect(lastCallArg).toBe(firstCategory)
  })

  it('calls fetchNextPage when bottom becomes visible and hasNextPage is true', () => {
    const fetchNextPageMock = jest.fn()

    useInfiniteQuestions.mockReturnValue({
      data: { pages: [{ result: { items: [] } }], pageParams: [] },
      isLoading: false,
      fetchNextPage: fetchNextPageMock,
      hasNextPage: true,
      isFetchingNextPage: false,
    })

    render(<Page />)

    // observe() immediately triggers the IntersectionObserver callback in our mock,
    // so fetchNextPage should have been called.
    expect(fetchNextPageMock).toHaveBeenCalled()
  })
})
