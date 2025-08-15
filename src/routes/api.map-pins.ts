import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { MapPinsServiceServer } from 'src/services/mapPinsService.server'

// runs on the server
export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)

  const mapPins = await new MapPinsServiceServer(client).get()

  return Response.json({ mapPins }, { headers })
}
