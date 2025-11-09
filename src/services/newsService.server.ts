import { UserRole } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { ProfileFactory } from 'src/factories/profileFactory.server'

import { ProfileServiceServer } from './profileService.server'
import { storageServiceServer } from './storageService.server'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBMedia, DBNews, News, Profile } from 'oa-shared'

async function filterNewsByUserFunctions(
  allNews: News[],
  client: SupabaseClient,
) {
  const claims = await client.auth.getClaims()

  if (!claims.data?.claims) {
    return allNews.filter((item) => !item.profileBadge)
  }

  const profileService = new ProfileServiceServer(client)
  const dbProfile = await profileService.getByAuthId(claims.data.claims.sub)
  const profile = new ProfileFactory(client).fromDB(dbProfile!)

  const isAdmin = profile.roles?.includes(UserRole.ADMIN) ?? false

  if (isAdmin) {
    return allNews
  }

  return filterNewsByUserBadges(allNews, profile)
}

function filterNewsByUserBadges(news: News[], profile: Profile): News[] {
  const userBadgeIds = new Set(profile.badges?.map((badge) => badge.id))

  return news.filter((item) => {
    if (!item.profileBadge) {
      return true
    }
    return userBadgeIds.has(item.profileBadge.id)
  })
}

async function getById(id: number, client: SupabaseClient) {
  const result = await client.from('news').select().eq('id', id).single()
  return result.data as DBNews
}

const getBySlug = (client: SupabaseClient, slug: string) => {
  return client
    .from('news')
    .select(
      `
       id,
       created_at,
       created_by,
       modified_at,
       comment_count,
       body,
       is_draft,
       moderation,
       slug,
       summary,
       category:category(id,name),
       profile_badge:profile_badge(*),
       tags,
       title,
       total_views,
       tenant_id,
       hero_image,
       author:profiles(id, display_name, username, country, badges:profile_badges_relations(
          profile_badges(
            id,
            name,
            display_name,
            image_url,
            action_url
          )
        ))
     `,
    )
    .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
    .or('deleted.eq.false,deleted.is.null')
    .single()
}

const getHeroImage = async (
  client: SupabaseClient,
  dbImage: DBMedia | null,
) => {
  if (!dbImage) {
    return null
  }

  const images = storageServiceServer.getPublicUrls(
    client,
    [dbImage],
    IMAGE_SIZES.GALLERY,
  )

  return images[0]
}

export const newsServiceServer = {
  filterNewsByUserFunctions,
  filterNewsByUserBadges,
  getById,
  getBySlug,
  getHeroImage,
}
