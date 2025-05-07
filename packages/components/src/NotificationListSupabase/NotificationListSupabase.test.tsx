import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './NotificationListSupabase.stories'

import type { IProps } from './NotificationListSupabase'

describe('Breadcrumbs', () => {
  it('Can show all notifications', () => {
    const { getAllByTestId } = render(<Default {...(Default.args as IProps)} />)

    const unreadNotifications = getAllByTestId('NotificationListItemSupabase')
    expect(unreadNotifications).toHaveLength(1)
  })

  // it('validate no category breadcrumbs', () => {
  //   const { getByText, getAllByTestId } = render(
  //     <NoCategory {...(NoCategory.args as BreadcrumbsProps)} />,
  //   )

  //   expect(getByText('Question')).toBeInTheDocument()
  //   expect(getByText('Are we real?')).toBeInTheDocument()
  //   const chevrons = getAllByTestId('breadcrumbsChevron')
  //   expect(chevrons).toHaveLength(1)
  // })
})
