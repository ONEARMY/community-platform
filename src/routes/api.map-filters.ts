import Keyv from 'keyv'
import { ProfileBadge, ProfileTag, ProfileType } from 'oa-shared'
import { isProductionEnvironment } from 'src/config/config'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type {
  DBMapSettings,
  DefaultMapFilters,
  FilterResponse,
  MapFilters,
} from 'oa-shared'

const cache = new Keyv<FilterResponse>({ ttl: 3600000 }) // expires 60 minutes after being set

export const loader = async ({ request }) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const cachedMapFilters = await cache.get('map-filters')

    if (cachedMapFilters && isProductionEnvironment()) {
      return Response.json(cachedMapFilters, { headers, status: 200 })
    }

    const [tags, badges, types, mapSettings] = await Promise.all([
      client.from('profile_tags').select('*'),
      client.from('profile_badges').select('*'),
      client.from('profile_types').select('*'),
      client.from('map_settings').select('*'),
    ])

    const errors = [tags, badges, types, mapSettings]
      .filter((x) => !!x.error)
      .flatMap((x) => x.error)
    if (errors.length) {
      console.error({ message: 'Error fetching map pin filters', errors })
    }

    const settings = mapSettings?.data?.at(0) as DBMapSettings | undefined

    const filters: MapFilters = {
      tags: tags?.data?.map((x) => ProfileTag.fromDB(x)),
      badges: badges?.data?.map((x) => ProfileBadge.fromDB(x)),
      types: types?.data?.map((x) => ProfileType.fromDB(x)),
      settings: settings?.setting_filters || undefined,
    }

    const defaultFilters: DefaultMapFilters = {
      types: settings?.default_type_filters || undefined,
    }

    const response: FilterResponse = { filters, defaultFilters }

    cache.set('map-filters', response)
    return Response.json(response, { headers })
  } catch (error) {
    console.error(error)
    return Response.json({}, { status: 500, headers })
  }
}
