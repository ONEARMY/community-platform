import { render } from '../tests/utils'
import { WithoutFlag } from './Username.stories'
import type { Props } from './Username'

describe('Username', () => {
  it('shows an unknown flag for empty value', () => {
    const { getByTestId } = render(
      <WithoutFlag {...(WithoutFlag.args as Props)} />,
    )

    expect(getByTestId('Username: unknown flag')).toBeInTheDocument()
  })
})
