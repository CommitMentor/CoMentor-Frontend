import '@testing-library/jest-dom'

// ResizeObserver 모킹
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))