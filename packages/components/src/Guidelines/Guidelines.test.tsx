import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './Guidelines.stories'

import type { IProps } from './Guidelines'

describe('Guidelines', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('How does it work?')).toBeInTheDocument()
    expect(
      getByText('Choose a topic you want to research', { exact: false }),
    ).toBeInTheDocument()
  })
})
