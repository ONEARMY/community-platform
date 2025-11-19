import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { DefaultComponent } from './Guidelines.stories'

describe('Guidelines', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<DefaultComponent />)

    expect(getByText('How does it work?')).toBeInTheDocument()
    expect(
      getByText('Choose a topic you want to research', { exact: false }),
    ).toBeInTheDocument()
  })
})
