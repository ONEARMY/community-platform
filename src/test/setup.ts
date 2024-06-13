// import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
// extends Vitest's expect method with methods from react-testing-library
// expect.extend(matchers)
import ResizeObserver from 'resize-observer-polyfill'
import { afterEach } from 'vitest'

global.ResizeObserver = ResizeObserver

if (!globalThis.defined) {
  globalThis.defined = true
}

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

globalThis.resetBeforeEachTest = true
