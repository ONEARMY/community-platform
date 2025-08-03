import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server'
import { userService } from 'src/services/userService.server'

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)
  const adminClient = createSupabaseAdminServerClient()

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const authId = user.id
  const { id: profileId, username } = await userService.getProfileForAuthUser(
    client,
    authId,
  )

  await userService.updateResearchUpdates(client, profileId)
  await userService.updateUserContentTypes(client, profileId, username)
  await userService.deleteUserContent(client, profileId)
  await userService.deleteProfileData(client, authId)
  await userService.deleteSupabaseUser(adminClient, authId)
  return await userService.logout(client, headers)
}
