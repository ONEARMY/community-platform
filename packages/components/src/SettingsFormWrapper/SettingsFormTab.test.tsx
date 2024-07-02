import '@testing-library/jest-dom/vitest'

import { Tabs } from '@mui/base/Tabs'
import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { SettingsFormTab } from './SettingsFormTab'

describe('SettingsFormTab', () => {
  it('renders all expected props', () => {
    const bodyText = 'Profile settings area'
    const headerText = 'Header area'
    const notificationText = 'Success message'

    const { getByText } = render(
      <Tabs defaultValue={0}>
        <SettingsFormTab
          tab={{
            body: <>{bodyText}</>,
            header: <>{headerText}</>,
            notifications: <>{notificationText}</>,
            title: 'Profile',
            glyph: 'comment',
          }}
          value={0}
        />
      </Tabs>,
    )

    expect(getByText(bodyText)).toBeInTheDocument()
    expect(getByText(headerText)).toBeInTheDocument()
    expect(getByText(notificationText)).toBeInTheDocument()
  })
})
