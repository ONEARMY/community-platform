import { AuthWrapper } from 'src/common/AuthWrapper'
import { SettingsPage } from './SettingsPage'
import { UserBadgeSettings } from './UserBadgeSettings'

export const UserSettings = (_props: { adminEditableUserId?: string }) => {
  return (
    <>
      <SettingsPage adminEditableUserId={_props.adminEditableUserId} />
      <AuthWrapper roleRequired="admin">
        {_props.adminEditableUserId && (
          <UserBadgeSettings userId={_props.adminEditableUserId} />
        )}
      </AuthWrapper>
    </>
  )
}
