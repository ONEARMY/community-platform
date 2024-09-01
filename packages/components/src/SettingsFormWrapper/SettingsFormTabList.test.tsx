import '@testing-library/jest-dom/vitest'

import { Tabs } from '@mui/base/Tabs'
import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { SettingsFormTabList } from './SettingsFormTabList'

import type { availableGlyphs } from '../Icon/types'

describe('SettingsFormTab', () => {
  const title = 'Title'
  const tab = {
    body: <></>,
    title,
    glyph: 'comment' as availableGlyphs,
  }

  it('renders when more than one tab provided', () => {
    const { getAllByText } = render(
      <Tabs defaultValue={0}>
        <SettingsFormTabList currentTab="title" tabs={[tab, tab]} />
      </Tabs>,
    )

    expect(getAllByText('Title')[0]).toBeInTheDocument()
  })

  it('renders nothing when only one tab provided', () => {
    const { queryByText } = render(
      <Tabs defaultValue={0}>
        <SettingsFormTabList currentTab="title" tabs={[tab]} />
      </Tabs>,
    )

    expect(queryByText(title)).not.toBeInTheDocument()
  })
})
