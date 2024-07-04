import { useLocation } from 'react-router-dom'
import { act, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ScrollToTop } from './ScrollToTop'

import type { Mock } from 'vitest'

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useLocation: vi.fn(),
}))

describe('ScrollToTop', () => {
  it('should scroll to top when pathname changes', () => {
    const scrollToSpy = vi.fn()
    global.window.scrollTo = scrollToSpy
    ;(useLocation as Mock).mockImplementation(() => ({
      pathname: '/initial',
    }))

    act(() => {
      render(<ScrollToTop />)
    })

    // Expect scrollTo be called once after initial render
    expect(scrollToSpy).toHaveBeenCalledTimes(1)
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0)

    // Reset the mock to track subsequent calls
    scrollToSpy.mockReset()
    ;(useLocation as Mock).mockImplementation(() => ({
      pathname: '/changed',
    }))

    act(() => {
      render(<ScrollToTop />)
    })

    // Expect scrollTo be called again after pathname changes
    expect(scrollToSpy).toHaveBeenCalledTimes(1)
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
  })
})
