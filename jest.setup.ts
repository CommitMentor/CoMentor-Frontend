import '@testing-library/jest-dom'

// ResizeObserver 모킹
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// window.scrollTo 모킹
window.scrollTo = jest.fn()

// HTMLFormElement.prototype.requestSubmit 모킹
HTMLFormElement.prototype.requestSubmit = function () {
  // submit 이벤트 발생 시뮬레이션
  const event = new Event('submit', { bubbles: true, cancelable: true })
  this.dispatchEvent(event)
}
