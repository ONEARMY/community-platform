import { SettingsPage } from './SettingsPage'

export const UserSettings = (_props: { adminEditableUserId?: string }) => {
  return (
    <>
      <SettingsPage adminEditableUserId={_props.adminEditableUserId} />
    </>
  )
}
