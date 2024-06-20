import '@testing-library/jest-dom/vitest'

import { act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './TabbedContent.stories'

describe('TabbedContent', () => {
  it('basic interaction', () => {
    const wrapper = render(<Default />)

    expect(wrapper.getByText('Tab #1')).toBeVisible()

    expect(() => wrapper.getByText('Tab Panel #2')).toThrow()
  })

  it('basic interaction', () => {
    const wrapper = render(<Default />)

    act(() => {
      wrapper.getByText('Tab #2').click()
    })

    expect(wrapper.getByText('Tab #1')).toBeVisible()

    expect(() => wrapper.getByText('Tab Panel #1')).toThrow()
    expect(wrapper.getByText('Tab Panel #2')).toBeInTheDocument()
  })
})
