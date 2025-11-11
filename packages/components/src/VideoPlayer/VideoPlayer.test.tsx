import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { VideoPlayer } from './VideoPlayer'

describe('VideoPlayer', () => {
  it('uses lazy load mechanism', () => {
    const { getByTitle } = render(
      <VideoPlayer videoUrl="https://www.youtube.com/watch?v=anqfVCLRQHE" />,
    )

    expect(() =>
      getByTitle('YEAR ONE. Everything we built on our abandoned land'),
    ).toThrow()
  })
})
