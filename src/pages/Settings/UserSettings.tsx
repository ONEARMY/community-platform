import { SettingsPage } from './SettingsPage'

export const UserSettings = (_props: { adminEditableUserId?: string }) => (
  <>
    <SettingsPage adminEditableUserId={_props.adminEditableUserId} />
  </>
)
