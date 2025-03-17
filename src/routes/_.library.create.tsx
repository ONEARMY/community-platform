/* eslint-disable unicorn/filename-case */
import { UserAction } from 'src/common/UserAction'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import CreateLibrary from 'src/pages/Library/CreateLibrary'
import { listing } from 'src/pages/Library/labels'
import { Box } from 'theme-ui'

export async function clientLoader() {
  return null
}

export default function Index() {
  const { incompleteProfile, loggedOut } = listing
  const sx = {
    alignSelf: 'center',
    paddingTop: 5,
  }

  return (
    <UserAction
      incompleteProfile={
        <Box data-cy="incomplete-profile-message" sx={sx}>
          {incompleteProfile}
        </Box>
      }
      loggedIn={
        <AuthRoute>
          <CreateLibrary />
        </AuthRoute>
      }
      loggedOut={
        <Box data-cy="logged-out-message" sx={sx}>
          {loggedOut}
        </Box>
      }
    />
  )
}
