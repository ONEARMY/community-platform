import { getFrameSrc } from './Academy'

// Mock out the useCommonStores method
// to prevent excessive amount of application
// being instantiated as part of the loading process
// This is a code smell, which needs to be resolved but
// is out of scope for the current task.
jest.mock('src/index', () => {
  return {
    useCommonStores: jest.fn(),
  }
})

describe('getFrameSrc', () => {
  const basePath = `https://example.com/`

  it.each([
    ['/', 'https://example.com/'],
    ['/academy/', 'https://example.com/'],
    ['/academy/path', 'https://example.com/path'],
  ])('formats a URL correctly', (path, expected) => {
    expect(getFrameSrc(basePath, path)).toBe(expected)
  })
})
