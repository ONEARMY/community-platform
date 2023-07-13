import { render } from '../tests/utils'
import type { Props } from './VideoPlayer'
import { Youtube } from './VideoPlayer.stories'

describe('VideoPlayer', () => {
  it('uses lazy load mechanism', () => {
    const { getByTitle } = render(<Youtube {...(Youtube.args as Props)} />)

    expect(() =>
      getByTitle('YEAR ONE. Everything we built on our abandoned land'),
    ).toThrow()
  })
})
