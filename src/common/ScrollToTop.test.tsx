import { render } from '@testing-library/react'
import { ScrollToTop } from './ScrollToTop'
import { useLocation } from 'react-router-dom'
import { act } from 'react-dom/test-utils'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}))

describe('ScrollToTop', () => {
  it('should scroll to top when pathname changes', async () => {
    const scrollToSpy = jest.fn()
    global.window.scrollTo = scrollToSpy
    ;(useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/initial',
    }))

    await act(async () => {
      render(<ScrollToTop />)
    })

    // Expect scrollTo be called once after initial render
    expect(scrollToSpy).toHaveBeenCalledTimes(1)
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0)

    // Reset the mock to track subsequent calls
    scrollToSpy.mockReset()
    ;(useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/changed',
    }))

    await act(async () => {
      render(<ScrollToTop />)
    })

    // Expect scrollTo be called again after pathname changes
    expect(scrollToSpy).toHaveBeenCalledTimes(1)
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
  })
})
