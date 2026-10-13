import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { RemakesPage } from 'src/pages/Admin/Remakes/RemakesPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { RemakeServiceServer } from 'src/services/remakeService.server';

export const handle = { breadcrumb: 'Remakes' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const remakes = await new RemakeServiceServer(client).getAll();

  return { remakes };
}

export default function Index() {
  const { remakes } = useLoaderData<typeof loader>();

  return <RemakesPage remakes={remakes} />;
}
