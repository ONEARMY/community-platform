import type { Props } from './ProfileLink'
import { Facebook, Instagram, Twitter, Youtube } from './ProfileLink.stories'
import { render } from '../tests/utils'

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
