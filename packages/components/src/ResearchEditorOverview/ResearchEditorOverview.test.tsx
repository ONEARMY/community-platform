import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import {
  Default,
  DraftItem,
  ShowBackToResearchButton,
  ShowCreateUpdateButton,
} from './ResearchEditorOverview.stories'

import type { ResearchEditorOverviewProps } from './ResearchEditorOverview'

describe('ResearchEditorOverview', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Default {...(Default.args as ResearchEditorOverviewProps)} />,
    )

    expect(container).toMatchSnapshot()
  })

  it('links back to research', () => {
    const { getByText } = render(
      <ShowBackToResearchButton
        {...(ShowBackToResearchButton.args as ResearchEditorOverviewProps)}
      />,
    )

    expect(getByText('Back to research')).toBeInTheDocument()
  })

  it('links to create update', () => {
    const { getByText } = render(
      <ShowCreateUpdateButton
        {...(ShowCreateUpdateButton.args as ResearchEditorOverviewProps)}
      />,
    )

    expect(getByText('Create update')).toBeInTheDocument()
  })

  it('handles empty updates', () => {
    const { container } = render(
      <Default
        {...(Default.args as ResearchEditorOverviewProps)}
        updates={[]}
      />,
    )

    expect(container).toMatchSnapshot()
  })

  it('handles falsey updates', () => {
    const { container } = render(
      <Default
        {...(Default.args as ResearchEditorOverviewProps)}
        updates={null as any}
      />,
    )

    expect(container).toMatchSnapshot()
  })

  it('handles malformed update item', () => {
    const { getByText } = render(
      <Default
        {...(Default.args as ResearchEditorOverviewProps)}
        updates={
          [
            {
              isActive: true,
              title: 'Update title',
              slug: 'a-slug',
            },
          ] as any
        }
      />,
    )

    expect(getByText('Update title')).toBeInTheDocument()
  })

  it('displays a Draft label', () => {
    const { getByText } = render(
      <DraftItem {...(DraftItem.args as ResearchEditorOverviewProps)} />,
    )

    expect(getByText('Draft')).toBeInTheDocument()
  })
})
