import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { SupabaseClient } from '@supabase/supabase-js'

const deleteProfile = async (client: SupabaseClient, userId: string) => {
  return await client
    .from('profiles')
    .delete()
    .eq('auth_id', userId)
}

const updateUserContent = async (client: SupabaseClient, userId: string) => {
  const content = ['research', 'library', 'questions', 'news']

  return content.forEach(contentType => {
    client.from(contentType)
      .update({ 'created_by': null })
      .eq('auth_id', userId)
  })
}

// TODO - this might not have to be an endpoint but a service
export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return Response.json({}, { headers, status: 401 })
  }

  await updateUserContent(client, user.id)

  await deleteProfile(client, user.id)

  return Response.json({}, { headers, status: 200 })
}
