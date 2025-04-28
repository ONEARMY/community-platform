import '@testing-library/jest-dom/vitest'

import { describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import { Default } from './ProfileTagsList.stories'

import type { IProps } from './ProfileTagsList'
import { ProfileTagsList } from './ProfileTagsList'

describe('ProfileTagsList', () => {
  it('shows the electronics tag from default arguments', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('Electronics')).toBeInTheDocument()
  })

  it('shows nothing when no tags or visitor info present', () => {
    const { getByTestId } = render(<ProfileTagsList tags={[]} />)

    expect(getByTestId('ProfileTagsList')).toBeEmptyDOMElement()
  })

  it('shows open when open for visitors', () => {
    const { getByText } = render(
      <ProfileTagsList tags={[]} openToVisitors={{ policy: 'open' }} />,
    )

    expect(getByText('Open to visitors ⓘ')).toBeInTheDocument()
  })

  it('shows appointment when visits by appointment', () => {
    const { getByText } = render(
      <ProfileTagsList tags={[]} openToVisitors={{ policy: 'appointment' }} />,
    )

    expect(getByText('Visitors after appointment ⓘ')).toBeInTheDocument()
  })

  it('triggers callback when clicking closed visitor tag', () => {
    const callback = vi.fn()
    const { getByText } = render(
      <ProfileTagsList
        tags={[]}
        openToVisitors={{ policy: 'closed' }}
        showVisitorModal={callback}
      />,
    )

    const visitorTag = getByText('Visits currently not possible ⓘ')
    expect(visitorTag).toBeInTheDocument()
    visitorTag.click()

    expect(callback).toBeCalled()
  })
})
