import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './NotificationListSupabase.stories'

import type { IProps } from './NotificationListSupabase'

describe('NotificationListSupabase', () => {
  it('Can show all notifications', () => {
    const { getAllByTestId } = render(<Default {...(Default.args as IProps)} />)

    const unreadNotifications = getAllByTestId('NotificationListItemSupabase')
    expect(unreadNotifications).toHaveLength(1)
  })
})
