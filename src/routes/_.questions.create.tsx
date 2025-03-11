import { UserAction } from 'src/common/UserAction'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import { listing } from 'src/pages/Question/labels'
import { QuestionCreate } from 'src/pages/Question/QuestionCreate'
import { Box } from 'theme-ui'

export async function clientLoader() {
  return null
}

export default function Index() {
  return (
    <UserAction
      incompleteProfile={
        <Box data-cy="incomplete-profile-message">
          Seriously though. {listing.incompleteProfile}
        </Box>
      }
      loggedIn={
        <AuthRoute>
          <QuestionCreate />
        </AuthRoute>
      }
      loggedOut={<>Dude. Gotta login please</>}
    />
  )
}
