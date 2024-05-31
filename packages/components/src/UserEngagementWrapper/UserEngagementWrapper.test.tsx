import '@testing-library/jest-dom'

import { describe, expect, it } from 'vitest'

import { render } from '../tests/utils'
import { Default } from './UserEngagementWrapper.stories'

import type { Props } from './UserEngagementWrapper'

describe('UserEngagementWrapper', () => {
  it('renders the children', () => {
    const { getByText } = render(<Default {...(Default.args as Props)} />)

    expect(getByText('Mark as useful')).toBeInTheDocument()
  })
})
