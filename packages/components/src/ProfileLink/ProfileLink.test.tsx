import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Facebook, Instagram, Twitter, Youtube } from './ProfileLink.stories'

import type { Props } from './ProfileLink'

describe('ProfileLink', () => {
  it('shows Twitter label', () => {
    const { getByText } = render(<Twitter {...(Twitter.args as Props)} />)

    expect(getByText('Twitter')).toBeInTheDocument()
  })

  it('shows Facebook label', () => {
    const { getByText } = render(<Facebook {...(Facebook.args as Props)} />)

    expect(getByText('Facebook')).toBeInTheDocument()
  })

  it('shows Youtube label', () => {
    const { getByText } = render(<Youtube {...(Youtube.args as Props)} />)

    expect(getByText('Youtube')).toBeInTheDocument()
  })

  it('shows Instagram label', () => {
    const { getByText } = render(<Instagram {...(Instagram.args as Props)} />)

    expect(getByText('Instagram')).toBeInTheDocument()
  })
})
