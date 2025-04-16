import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './NotificationListSupabase.stories'

import type { IProps } from './NotificationListSupabase'

describe('NotificationListSupabase', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('NotificationListSupabase')).toBeInTheDocument()
  })
})
