import { ClientOnly } from 'remix-utils/client-only'

import { ProfileButtonItem } from './ProfileButtonItem'

const ProfileButtons = () => {
  return (
    <ClientOnly fallback={<></>}>
      {() => (
        <>
          <ProfileButtonItem
            link="/sign-in"
            text="Login"
            variant="secondary"
            sx={{
              fontWeight: 'bold',
              fontSize: [1, 2],
            }}
          />
          <ProfileButtonItem
            link="/sign-up"
            text="Join"
            variant="outline"
            sx={{ fontSize: [1, 2] }}
          />
        </>
      )}
    </ClientOnly>
  )
}

export default ProfileButtons
