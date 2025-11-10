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
Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  value: function () {
    // submit 이벤트 발생 시뮬레이션
    const event = new Event('submit', { bubbles: true, cancelable: true })
    this.dispatchEvent(event)
  },
  writable: true,
  configurable: true,
})

const originalError = console.error
console.error = (...args: any[]) => {
  if (args[0]?.type === 'not implemented') {
    return
  }
  originalError(...args)
}
