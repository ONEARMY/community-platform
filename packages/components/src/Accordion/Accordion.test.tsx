import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './Accordion.stories'

import type { IProps } from './Accordion'

describe('Accordion', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('Accordion')).toBeInTheDocument()
  })
})
