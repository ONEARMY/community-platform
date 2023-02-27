import { SettingsPage } from './SettingsPage'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { UserBadgeSettings } from './UserBadgeSettings'

export const UserSettings = (_props: { adminEditableUserId?: string }) => {
  return (
    <>
      <SettingsPage adminEditableUserId={_props.adminEditableUserId} />
      <AuthWrapper
        roleRequired="admin"
        fallback={<span data-testid="Admin role required" />}
      >
        {_props.adminEditableUserId ? (
          <UserBadgeSettings userId={_props.adminEditableUserId} />
        ) : null}
      </AuthWrapper>
    </>
  )
}
