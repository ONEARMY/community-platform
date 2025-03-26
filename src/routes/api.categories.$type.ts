import Keyv from 'keyv'
import { Category } from 'oa-shared'
import { isProductionEnvironment } from 'src/config/config'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { ContentType, DBCategory } from 'oa-shared'

const cache = new Keyv<Category[]>({ ttl: 3600000 }) // ttl: 60 minutes

const filterByType = (categories: Category[], type: ContentType) => {
  return categories.filter((category) => category.type === type)
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const type = params.type as ContentType
  const { client, headers } = createSupabaseServerClient(request)

  if (!type) {
    return Response.json(
      {},
      { headers, status: 400, statusText: 'type is required' },
    )
  }

  const cachedCategories = await cache.get('categories')

  if (cachedCategories && isProductionEnvironment()) {
    const categoriesForType = filterByType(cachedCategories, type)
    return Response.json(categoriesForType, { headers, status: 200 })
  }

  const { data } = await client
    .from('categories')
    .select('id,name,created_at,type')

  const categories = data?.map((category) =>
    Category.fromDB(category as DBCategory),
  )

  if (categories && categories.length > 0) {
    cache.set('categories', data, 3600000)
  }

  const categoriesForType = categories ? filterByType(categories, type) : []

  return Response.json(categoriesForType, { headers, status: 200 })
}
