import Keyv from 'keyv'
import { isProductionEnvironment } from 'src/config/config'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { ContentTypes, DBCategory } from 'oa-shared'

const cache = new Keyv<DBCategory[]>({ ttl: 3600000 }) // ttl: 60 minutes

const filterByType = (categories: DBCategory[], type: ContentTypes) => {
  return categories.filter((category) => category.type === type)
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const type = params.type as ContentTypes
  const { client, headers } = createSupabaseServerClient(request)

  if (!type) {
    return Response.json(
      {},
      { headers, status: 400, statusText: 'type is required' },
    )
  }

  const cachedCategories = await cache.get('categories')

  if (cachedCategories && isProductionEnvironment()) {
    return Response.json(
      { categories: filterByType(cachedCategories, type) },
      { headers, status: 200 },
    )
  }

  const { data } = await client
    .from('categories')
    .select('id,name,created_at,type')

  if (data && data.length > 0) {
    cache.set('categories', data, 3600000)
  }

  const categories = filterByType(data as DBCategory[], type) || []

  return Response.json(categories, { headers, status: 200 })
}
