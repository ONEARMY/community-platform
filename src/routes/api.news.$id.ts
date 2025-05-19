import { News } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { contentServiceServer } from 'src/services/contentService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { getSummaryFromMarkdown } from 'src/utils/getSummaryFromMarkdown'
import { hasAdminRightsSupabase, validateImage } from 'src/utils/helpers'
import { convertToSlug } from 'src/utils/slug'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { Params } from '@remix-run/react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBNews, DBProfile } from 'oa-shared'

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const formData = await request.formData()
    const data = {
      body: formData.get('body') as string,
      category: formData.has('category')
        ? Number(formData.get('category'))
        : null,
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
      title: formData.get('title') as string,
    }

    const { client, headers } = createSupabaseServerClient(request)

    const {
      data: { user },
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(
      params,
      request,
      user,
      data,
      client,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const slug = convertToSlug(data.title)
    const existingHeroImage = formData.get('existingHeroImage') as string | null
    const newHeroImage = formData.get('heroImage') as File | null
    const imageValidation = validateImage(newHeroImage)

    if (!imageValidation.valid && imageValidation.error) {
      return Response.json(
        {},
        {
          status: 400,
          statusText: imageValidation.error.message,
        },
      )
    }

    const newsResult = await client
      .from('news')
      .update({
        body: data.body,
        category: data.category,
        modified_at: new Date(),
        slug,
        summary: getSummaryFromMarkdown(data.body),
        tags: data.tags,
        title: data.title,
        ...(!existingHeroImage && { hero_image: null }),
      })
      .eq('id', params.id)
      .select()

    if (newsResult.error || !newsResult.data) {
      throw newsResult.error
    }

    const news = News.fromDB(newsResult.data[0], [])

    if (newHeroImage) {
      const mediaFiles = await storageServiceServer.uploadImage(
        [newHeroImage],
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

    return Response.json({ news }, { headers, status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({}, { status: 500, statusText: 'Error creating news' })
  }
}

async function validateRequest(
  params: Params<string>,
  request: Request,
  user: User | null,
  data: any,
  client: SupabaseClient,
) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'PUT') {
    return { status: 405, statusText: 'Method not allowed' }
  }

  if (!params.id) {
    return { status: 400, statusText: 'id is required' }
  }

  if (!data.title) {
    return { status: 400, statusText: 'Title is required' }
  }

  if (!data.body) {
    return { status: 400, statusText: 'Body is required' }
  }

  const slug = convertToSlug(data.title)
  const newsId = Number(params.id!)

  if (
    await contentServiceServer.isDuplicateExistingSlug(
      slug,
      newsId,
      client,
      'news',
    )
  ) {
    return {
      status: 409,
      statusText: 'This news already exists',
    }
  }

  const existingNewsResult = await client
    .from('news')
    .select()
    .eq('id', newsId)
    .single()

  if (existingNewsResult.error || !existingNewsResult.data) {
    return { status: 400, statusText: 'News not found' }
  }

  const existingNews = existingNewsResult.data as DBNews

  const profileRequest = await client
    .from('profiles')
    .select('id,roles')
    .eq('auth_id', user.id)
    .limit(1)

  if (profileRequest.error || !profileRequest.data?.at(0)) {
    return { status: 400, statusText: 'User not found' }
  }

  const profile = profileRequest.data[0] as DBProfile
  const isCreator = existingNews.created_by === profile.id
  const hasAdminRights = hasAdminRightsSupabase(profile)

  if (!isCreator && !hasAdminRights) {
    return { status: 403, statusText: 'Unauthorized' }
  }

  return { valid: true }
}
