import type { DBCategory } from 'oa-shared';
import { Category } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { CategoriesPage } from 'src/pages/Admin/Categories/CategoriesPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const handle = { breadcrumb: 'Categories' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const { data } = await client
    .from('categories')
    .select('id,name,created_at,type,image_url,description')
    .order('type');

  const categories = (data || []).map((category) => Category.fromDB(category as DBCategory));

  return { categories };
}

export default function Index() {
  const { categories } = useLoaderData<typeof loader>();

  return <CategoriesPage categories={categories} />;
}
