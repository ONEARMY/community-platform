import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { userService } from 'src/services/userService.server'

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  const authId = user.id
  const profileId = await userService.getProfileIdForAuthUser(client, authId)

  await userService.updateUserContent(client, profileId)
  await userService.deleteProfileData(client, authId)
  await userService.deleteSupabaseUser(client, authId)
  return await userService.logout(client, headers)
}
