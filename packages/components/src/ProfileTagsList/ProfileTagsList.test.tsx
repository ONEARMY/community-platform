import '@testing-library/jest-dom/vitest'

import { describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import { ProfileTagsList } from './ProfileTagsList'
import { Default } from './ProfileTagsList.stories'

import type { IProps } from './ProfileTagsList'

describe('ProfileTagsList', () => {
  it('shows the electronics tag from default arguments', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('Electronics')).toBeInTheDocument()
  })

  it('shows nothing when no tags or visitor info present', () => {
    const { getByTestId } = render(<ProfileTagsList tags={[]} isSpace />)

    expect(getByTestId('ProfileTagsList')).toBeEmptyDOMElement()
  })

  it('shows open when open for visitors', () => {
    const { getByText } = render(
      <ProfileTagsList tags={[]} openToVisitors={{ policy: 'open' }} isSpace />,
    )

    expect(getByText('Open to visitors', { exact: false })).toBeInTheDocument()
  })

  it('shows appointment when visits by appointment', () => {
    const { getByText } = render(
      <ProfileTagsList
        tags={[]}
        openToVisitors={{ policy: 'appointment' }}
        isSpace
      />,
    )

    expect(
      getByText('Visitors after appointment', { exact: false }),
    ).toBeInTheDocument()
  })

  it('triggers callback when clicking closed visitor tag', () => {
    const callback = vi.fn()
    const { getByText } = render(
      <ProfileTagsList
        tags={[]}
        openToVisitors={{ policy: 'closed' }}
        showVisitorModal={callback}
        isSpace
      />,
    )

    const visitorTag = getByText('Visits currently not possible', {
      exact: false,
    })
    expect(visitorTag).toBeInTheDocument()
    visitorTag.click()

    expect(callback).toBeCalled()
  })
})
