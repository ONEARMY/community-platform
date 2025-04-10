import { redirect } from '@remix-run/node'
import { UserAction } from 'src/common/UserAction'
import { QuestionForm } from 'src/pages/Question/Content/Common/QuestionForm'
import { listing } from 'src/pages/Question/labels'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { Box } from 'theme-ui'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)
  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return redirect('/questions', { headers })
  }

  return null
}

export default function Index() {
  return (
    <UserAction
      incompleteProfile={
        <Box
          data-cy="incomplete-profile-message"
          sx={{ alignSelf: 'center', paddingTop: 5 }}
        >
          {listing.incompleteProfile}
        </Box>
      }
      loggedIn={
        <QuestionForm
          data-testid="question-create-form"
          parentType="create"
          question={null}
        />
      }
      loggedOut={<></>}
    />
  )
}
