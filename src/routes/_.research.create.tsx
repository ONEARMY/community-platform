import { UserAction } from 'src/common/UserAction'
import { isPreciousPlastic } from 'src/config/config'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import { RESEARCH_EDITOR_ROLES } from 'src/pages/Research/constants'
import CreateResearch from 'src/pages/Research/Content/CreateResearch'
import { listing } from 'src/pages/Research/labels'
import { Box } from 'theme-ui'

export async function loader() {
  return null
}

export default function Index() {
  const { incompleteProfile, loggedOut } = listing
  const roles = isPreciousPlastic() ? [] : RESEARCH_EDITOR_ROLES
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
        <AuthRoute roleRequired={roles}>
          <CreateResearch />
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
