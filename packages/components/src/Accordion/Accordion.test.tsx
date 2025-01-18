import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './Accordion.stories'
import type { IProps } from './Accordion'

describe('Accordion', () => {
  it('displays the accordion body on click', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)
    const accordionTitle = getByText('Accordion Title')
    expect(getByText('Now you see me!')).not.toBeInTheDocument()

    accordionTitle.click()

    expect(getByText('Now you see me!')).toBeInTheDocument()
  })
})
