import { News } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { contentServiceServer } from 'src/services/contentService.server'
import { newsServiceServer } from 'src/services/newsService.server'
import { ProfileServiceServer } from 'src/services/profileService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { getSummaryFromMarkdown } from 'src/utils/getSummaryFromMarkdown'
import { hasAdminRightsSupabase, validateImage } from 'src/utils/helpers'
import { convertToSlug } from 'src/utils/slug'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { Params } from '@remix-run/react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { DBNews } from 'oa-shared'

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const id = Number(params.id)
    const formData = await request.formData()
    const data = {
      body: formData.get('body') as string,
      category: formData.has('category')
        ? Number(formData.get('category'))
        : null,
      isDraft: formData.get('is_draft') === 'true',
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
      title: formData.get('title') as string,
      slug: convertToSlug(formData.get('title') as string),
    }

    const { client, headers } = createSupabaseServerClient(request)

    const {
      data: { user },
    } = await client.auth.getUser()

    const currentNews = await newsServiceServer.getById(id, client)

    const { valid, status, statusText } = await validateRequest(
      params,
      request,
      user,
      data,
      currentNews,
      client,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

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

    const previousSlugs = contentServiceServer.updatePreviousSlugs(
      currentNews,
      data.slug,
    )

    const newsResult = await client
      .from('news')
      .update({
        body: data.body,
        category: data.category,
        is_draft: data.isDraft,
        modified_at: new Date(),
        slug: data.slug,
        previous_slugs: previousSlugs,
        summary: getSummaryFromMarkdown(data.body),
        tags: data.tags,
        title: data.title,
        ...(!existingHeroImage && { hero_image: null }),
      })
      .eq('id', id)
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
    console.error(error)
    return Response.json({}, { status: 500, statusText: 'Error creating news' })
  }
}

async function validateRequest(
  params: Params<string>,
  request: Request,
  user: User | null,
  data: any,
  currentNews: DBNews,
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

  if (!currentNews) {
    return { status: 400, statusText: 'News not found' }
  }

  if (
    currentNews.slug !== data.slug &&
    (await contentServiceServer.isDuplicateExistingSlug(
      data.slug,
      currentNews.id,
      client,
      'news',
    ))
  ) {
    return {
      status: 409,
      statusText: 'This news already exists',
    }
  }

  const profileService = new ProfileServiceServer(client)
  const profile = await profileService.getByAuthId(user!.id)

  if (!profile) {
    return { status: 400, statusText: 'User not found' }
  }

  const isCreator = currentNews.created_by === profile.id
  const hasAdminRights = hasAdminRightsSupabase(profile)

  if (!isCreator && !hasAdminRights) {
    return { status: 403, statusText: 'Unauthorized' }
  }

  return { valid: true }
}
