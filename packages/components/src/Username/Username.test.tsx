import { Username } from './Username'
import { InvalidCountryCode, WithoutFlag } from './Username.stories'
import { render } from '../tests/utils'

describe('Username', () => {
  it('shows an unknown flag for empty value', () => {
    const { getByTestId } = render(<Username {...WithoutFlag.args} />)

    expect(getByTestId('Username: unknown flag')).toBeInTheDocument()
  })

  it('shows an unknown flag for an invalid country code', () => {
    const { getByTestId } = render(<Username {...InvalidCountryCode.args} />)

    expect(getByTestId('Username: unknown flag')).toBeInTheDocument()
  })
})
