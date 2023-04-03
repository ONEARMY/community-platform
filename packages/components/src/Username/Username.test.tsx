import { render } from '../tests/utils'
import { InvalidCountryCode, WithoutFlag } from './Username.stories'
import type { Props } from './Username'

describe('Username', () => {
  it('shows an unknown flag for empty value', () => {
    const { getByTestId } = render(
      <WithoutFlag {...(WithoutFlag.args as Props)} />,
    )

    expect(getByTestId('Username: unknown flag')).toBeInTheDocument()
  })

  it('shows an unknown flag for an invalid country code', () => {
    const { getByTestId } = render(
      <InvalidCountryCode {...(InvalidCountryCode.args as Props)} />,
    )

    expect(getByTestId('Username: unknown flag')).toBeInTheDocument()
  })
})
