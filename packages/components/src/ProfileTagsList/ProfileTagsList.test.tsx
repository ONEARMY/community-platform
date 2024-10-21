import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './ProfileTagsList.stories'

import type { IProps } from './ProfileTagsList'

describe('ProfileTagsList', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('Electronics')).toBeInTheDocument()
  })
})
