// TODO: split this in separate files once we update remix to NOT use file-based routing

import { News } from 'oa-shared'
import { ITEMS_PER_PAGE } from 'src/pages/News/constants'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { discordServiceServer } from 'src/services/discordService.server'
import { newsServiceServer } from 'src/services/newsService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { subscribersServiceServer } from 'src/services/subscribersService.server'
import { getSummaryFromMarkdown } from 'src/utils/getSummaryFromMarkdown'
import { validateImage } from 'src/utils/helpers'
import { convertToSlug } from 'src/utils/slug'

import { contentServiceServer } from '../services/contentService.server'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { AuthError, User } from '@supabase/supabase-js'
import type { DBNews, DBProfile, Moderation } from 'oa-shared'
import type { NewsSortOption } from 'src/pages/News/NewsSortOptions'

export const loader = async ({ request }) => {
  const url = new URL(request.url)
  const params = new URLSearchParams(url.search)
  const q = params.get('q')
  const sort = params.get('sort') as NewsSortOption
  const skip = Number(params.get('skip')) || 0

  const { client, headers } = createSupabaseServerClient(request)

  let query = client
    .from('news')
    .select(
      `
      id,
      created_at,
      created_by,
      modified_at,
      is_draft,
      comment_count,
      body,
      slug,
      summary,
      category:category(id,name),
      profile_badge:profile_badge(*),
      tags,
      title,
      total_views,
      hero_image,
      author:profiles(id, display_name, username, country, badges:profile_badges_relations(
        profile_badges(
          id,
          name,
          display_name,
          image_url,
          action_url
        )
      ))`,
    )
    .eq('is_draft', false)

  if (q) {
    query = query.textSearch('news_search_fields', q)
  }

  if (sort === 'Newest') {
    query = query.order('created_at', { ascending: false })
  } else if (sort === 'Comments') {
    query = query.order('comment_count', { ascending: false })
  } else if (sort === 'LeastComments') {
    query = query.order('comment_count', { ascending: true })
  }

  const queryResult = await query.range(skip, skip + ITEMS_PER_PAGE) // 0 based

  const total = queryResult.count
  const data = queryResult.data as unknown as DBNews[]
  const allNews = data.map((dbNews) => News.fromDB(dbNews, []))
  const items = await newsServiceServer.filterNewsByUserFunctions(
    allNews,
    client,
  )

  if (items && items.length > 0) {
    // Populate useful votes
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'news',
      p_content_ids: items.map((x) => x.id),
    })

    if (votes.data) {
      const votesByContentId = votes.data.reduce((acc, current) => {
        acc.set(current.content_id, current.count)
        return acc
      }, new Map())

      for (const item of items) {
        if (votesByContentId.has(item.id)) {
          item.usefulCount = votesByContentId.get(item.id)!
        }
        item.heroImage = await newsServiceServer.getHeroImage(
          client,
          data.find((x) => x.id === item.id)?.hero_image || null,
        )
      }
    }
  }

  return Response.json({ items, total }, { headers })
}

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const formData = await request.formData()
    const data = {
      body: formData.get('body') as string,
      category: formData.has('category')
        ? (formData.get('category') as string)
        : null,
      isDraft: formData.get('is_draft') === 'true',
      profileBadge: formData.has('profileBadge')
        ? (formData.get('profileBadge') as string)
        : null,
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
      title: formData.get('title') as string,
    }

    const {
      data: { user },
      error,
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(
      request,
      user,
      data,
      error,
    )

    if (!valid) {
      return Response.json({}, { headers, status, statusText })
    }

    const slug = convertToSlug(data.title)

    if (await contentServiceServer.isDuplicateNewSlug(slug, client, 'news')) {
      return Response.json(
        {},
        {
          headers,
          status: 409,
          statusText: 'This news already exists',
        },
      )
    }

    const uploadedHeroImageFile = formData.get('heroImage') as File | null
    const imageValidation = validateImage(uploadedHeroImageFile)

    if (!imageValidation.valid && imageValidation.error) {
      return Response.json(
        {},
        {
          headers,
          status: 400,
          statusText: imageValidation.error.message || 'Error uploading image',
        },
      )
    }

    const profileRequest = await client
      .from('profiles')
      .select('id,username')
      .eq('auth_id', user!.id)
      .limit(1)

    if (profileRequest.error || !profileRequest.data?.at(0)) {
      console.error(profileRequest.error)
      return Response.json(
        {},
        { headers, status: 400, statusText: 'User not found' },
      )
    }

    const profile = profileRequest.data[0] as DBProfile

    const newsResult = await client
      .from('news')
      .insert({
        body: data.body,
        category: data.category,
        created_by: profile.id,
        is_draft: data.isDraft,
        moderation: 'accepted' as Moderation,
        profile_badge: data.profileBadge,
        slug,
        summary: getSummaryFromMarkdown(data.body),
        tags: data.tags,
        tenant_id: process.env.TENANT_ID,
        title: data.title,
      })
      .select()

    if (newsResult.error || !newsResult.data) {
      throw newsResult.error
    }

    const news = News.fromDB(newsResult.data[0], [])
    subscribersServiceServer.add('news', news.id, profile.id, client, headers)

    if (!news.isDraft) {
      notifyDiscord(
        news,
        profile,
        new URL(request.url).origin.replace('http:', 'https:'),
      )
    }

    if (uploadedHeroImageFile) {
      const mediaFiles = await storageServiceServer.uploadImage(
        [uploadedHeroImageFile],
        `news/${news.id}`,
        client,
      )

      if (mediaFiles?.media?.length) {
        await client
          .from('news')
          .update({
            hero_image: mediaFiles.media.at(0),
          })
          .eq('id', news.id)

        const [image] = storageServiceServer.getPublicUrls(
          client,
          mediaFiles.media,
        )

        news.heroImage = image
      }
    }

    return Response.json({ news }, { headers, status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { headers, status: 500, statusText: 'Error creating news' },
    )
  }
}

function notifyDiscord(news: News, profile: DBProfile, siteUrl: string) {
  const title = news.title
  const slug = news.slug

  discordServiceServer.postWebhookRequest(
    `📰 ${profile.username} has news: ${title}\n<${siteUrl}/news/${slug}>`,
  )
}

async function validateRequest(
  request: Request,
  user: User | null,
  data: any,
  authError: AuthError | null,
) {
  if (authError) {
    return {
      status: authError?.status,
      statusText: authError?.message || 'Unknown authentication error',
    }
  }

  if (!user) {
    return { status: 401, statusText: 'Unauthorized: No user found' }
  }

  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!data.title) {
    return { status: 400, statusText: 'title is required' }
  }

  if (!data.body) {
    return { status: 400, statusText: 'body is required' }
  }

  return { valid: true }
}
