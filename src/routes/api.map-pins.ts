import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { MapPinsServiceServer } from 'src/services/mapPinsService.server';

// runs on the server
export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const mapPins = await new MapPinsServiceServer(client).get();
    return Response.json({ mapPins }, { headers });
  } catch (error) {
    console.error(error);

    return Response.json({}, { headers, status: 500, statusText: 'Error fetching map-pins' });
  }
};
