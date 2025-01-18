import Keyv from 'keyv'
import { isProductionEnvironment } from 'src/config/config'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { Category } from 'src/models/category.model'

const cache = new Keyv<Category[]>({ ttl: 3600000 }) // ttl: 60 minutes

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)

  const cachedCategories = await cache.get('questionCategories')

  // check if cached categories are available, if not - load from db and cache them
  if (cachedCategories && isProductionEnvironment()) {
    return Response.json(
      { categories: cachedCategories },
      { headers, status: 200 },
    )
  }

  const { data } = await client
    .from('categories')
    .select('id,name')
    .eq('type', 'questions')

  const categories = data || []

  if (categories.length > 0) {
    cache.set('questionCategories', categories, 3600000)
  }

  return Response.json(
    { categories: cachedCategories },
    { headers, status: 200 },
  )
}
