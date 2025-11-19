import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server'

import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const profileService = new ProfileTypesServiceServer(client)
    const profileTypes = await profileService.get()

    return Response.json(profileTypes, { headers, status: 200 })
  } catch (error) {
    console.error(error)
  }

  return Response.json({}, { headers, status: 500 })
}
