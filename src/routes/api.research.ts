import { ResearchItem } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { ITEMS_PER_PAGE } from 'src/pages/Research/constants'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { contentServiceServer } from 'src/services/contentService.server'
import { ProfileServiceServer } from 'src/services/profileService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { subscribersServiceServer } from 'src/services/subscribersService.server'
import { updateUserActivity } from 'src/utils/activity.server'
import { convertToSlug } from 'src/utils/slug'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import type { DBResearchItem, ResearchStatus } from 'oa-shared'
import type { ResearchSortOption } from 'src/pages/Research/ResearchSortOptions.ts'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  const q = searchParams.get('q')
  const category = Number(searchParams.get('category')) || undefined
  const sort = searchParams.get('sort') as ResearchSortOption
  const skip = Number(searchParams.get('skip')) || 0
  const status: ResearchStatus | null = searchParams.get(
    'status',
  ) as ResearchStatus

  const { client, headers } = createSupabaseServerClient(request)

  const { data, error } = await client.rpc('get_research', {
    search_query: q || null,
    category_id: category,
    research_status: status || null,
    sort_by: sort,
    offset_val: skip,
    limit_val: ITEMS_PER_PAGE,
  })

  const countResult = await client.rpc('get_research_count', {
    search_query: q || null,
    category_id: category,
    research_status: status || null,
  })
  const count = countResult.data || 0

  if (error) {
    console.error(error)
    return Response.json({}, { status: 500, headers })
  }

  const dbItems = data as DBResearchItem[]

  if (!dbItems || dbItems.length === 0) {
    return Response.json({ items: [], total: 0 }, { headers })
  }

  const items = dbItems.map((dbResearchItem) => {
    const images = dbResearchItem.image
      ? storageServiceServer.getPublicUrls(
          client,
          [dbResearchItem.image],
          IMAGE_SIZES.LIST,
        )
      : []
    return ResearchItem.fromDB(dbResearchItem, [], images)
  })

  if (items && items.length > 0) {
    // Populate useful votes
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'research',
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
      }
    }
  }

  return Response.json({ items, total: count }, { headers })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const formData = await request.formData()
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      isDraft: formData.get('draft') === 'true',
      category: formData.has('category')
        ? (formData.get('category') as string)
        : null,
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
      collaborators: formData.has('collaborators')
        ? (formData.getAll('collaborators') as string[])
        : null,
      uploadedImage: formData.get('image') as File | null,
    }

    const claims = await client.auth.getClaims()

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 })
    }

    const { valid, status, statusText } = await validateRequest(request, data)

    if (!valid) {
      return Response.json({}, { headers, status, statusText })
    }

    const slug = convertToSlug(data.title)

    if (
      await contentServiceServer.isDuplicateNewSlug(slug, client, 'research')
    ) {
      return Response.json(
        {},
        {
          status: 409,
          statusText: 'This research already exists',
        },
      )
    }

    const profileService = new ProfileServiceServer(client)
    const profile = await profileService.getByAuthId(claims.data.claims.sub)

    if (!profile) {
      return Response.json(
        {},
        { headers, status: 400, statusText: 'User not found' },
      )
    }

    const researchStatus: ResearchStatus = 'in-progress'
    const researchResult = await client
      .from('research')
      .insert({
        created_by: profile.id,
        title: data.title,
        description: data.description,
        slug,
        category: data.category,
        tags: data.tags,
        collaborators: data.collaborators,
        status: researchStatus,
        is_draft: data.isDraft,
        tenant_id: process.env.TENANT_ID,
      })
      .select()
      .single()

    if (researchResult.error || !researchResult.data) {
      throw researchResult.error
    }

    const research = ResearchItem.fromDB(
      researchResult.data,
      [],
      [],
      researchResult.data.collaborators,
    )

    await subscribersServiceServer.addResearchSubscribers(
      research,
      profile.id,
      client,
      headers,
    )

    if (data.uploadedImage) {
      const mediaResult = await storageServiceServer.uploadImage(
        [data.uploadedImage],
        `research/${research.id}`,
        client,
      )

      if (mediaResult?.errors) {
        console.error(mediaResult.errors)
      }

      if (mediaResult?.media && mediaResult.media.length > 0) {
        const result = await client
          .from('research')
          .update({ image: mediaResult.media[0] })
          .eq('id', research.id)
          .select()

        if (result.data) {
          research.image = result.data[0].image
        }
      }
    }

    updateUserActivity(client, claims.data.claims.sub)

    return Response.json({ research }, { headers, status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { headers, status: 500, statusText: 'Error creating research' },
    )
  }
}

async function validateRequest(request: Request, data: any) {
  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!data.title) {
    return { status: 400, statusText: 'title is required' }
  }

  if (!data.description) {
    return { status: 400, statusText: 'description is required' }
  }

  if (!data.isDraft && !data.uploadedImage && !data.existingImage) {
    return { status: 400, statusText: 'image is required' }
  }

  return { valid: true }
}
