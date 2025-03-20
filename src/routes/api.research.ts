import { IModerationStatus } from 'oa-shared'
import { ResearchItem } from 'src/models/research.model'
import { ITEMS_PER_PAGE } from 'src/pages/Research/constants'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { discordServiceServer } from 'src/services/discordService.server'
import { convertToSlug } from 'src/utils/slug'
import { SUPPORTED_IMAGE_TYPES } from 'src/utils/storage'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { ResearchStatus } from 'oa-shared'
import type { DBProfile } from 'src/models/profile.model'
import type { ResearchSortOption } from 'src/pages/Research/ResearchSortOptions.ts'

// runs on the server
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
  const drafts: boolean = searchParams.get('drafts') != undefined

  const { client, headers } = createSupabaseServerClient(request)

  // if (drafts) {
  //   const {
  //     data: { user },
  //   } = await client.auth.getUser()

  //   if (!user) {
  //     return Response.json({}, { headers, status: 401 })
  //   }

  //   const userProfile = await client
  //     .from('profiles')
  //     .select('id')
  //     .eq('auth_id', user.id)
  //     .limit(1)
  //   const profileId = userProfile.data?.at(0)?.id

  //   if (!profileId) {
  //     return Response.json({ items: [], total: 0 }, { headers })
  //   }

  //   query = query.eq('is_draft', true).eq('created_by', profileId)
  // }

  const { data, count, error } = await client.rpc('get_research', {
    search_query: q,
    category_id: category,
    research_status: status || null,
    sort_by: sort,
    offset_val: skip,
    limit_val: ITEMS_PER_PAGE,
  })

  if (error) {
    console.error(error)
    return Response.json({}, { status: 500, headers })
  }

  const items = data.map((x) => ResearchItem.fromDB(x, [], []))

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
  try {
    const formData = await request.formData()
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.has('category')
        ? (formData.get('category') as string)
        : null,
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
    }

    const { client, headers } = createSupabaseServerClient(request)

    const {
      data: { user },
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(
      request,
      user,
      data,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const slug = convertToSlug(data.title)

    if (await isDuplicateSlug(slug, client)) {
      return Response.json(
        {},
        {
          status: 409,
          statusText: 'This research already exists',
        },
      )
    }

    const uploadedImages = formData.getAll('images') as File[]
    const imageValidation = validateImages(uploadedImages)

    if (!imageValidation.valid) {
      return Response.json(
        {},
        {
          status: 400,
          statusText: imageValidation.errors.join(', '),
        },
      )
    }
    const profileRequest = await client
      .from('profiles')
      .select('id')
      .eq('auth_id', user!.id)
      .limit(1)

    if (profileRequest.error || !profileRequest.data?.at(0)) {
      console.log(profileRequest.error)
      return Response.json({}, { status: 400, statusText: 'User not found' })
    }

    const profile = profileRequest.data[0] as DBProfile

    const researchResult = await client
      .from('research')
      .insert({
        created_by: profile.id,
        title: data.title,
        description: data.description,
        moderation: IModerationStatus.ACCEPTED,
        slug,
        category: data.category,
        tags: data.tags,
        tenant_id: process.env.TENANT_ID,
      })
      .select()

    if (researchResult.error || !researchResult.data) {
      throw researchResult.error
    }

    const research = ResearchItem.fromDB(researchResult.data[0], [])

    if (uploadedImages.length > 0) {
      const researchId = Number(researchResult.data[0].id)

      const imageResult = await uploadImages(researchId, uploadedImages, client)

      if (imageResult?.images && imageResult.images.length > 0) {
        const updateResult = await client
          .from('research')
          .update({ images: imageResult.images })
          .eq('id', researchId)
          .select()

        if (updateResult.data) {
          research.images = updateResult.data[0].images
        }
      }
    }

    notifyDiscord(research, profile, new URL(request.url).origin)

    return Response.json({ research }, { headers, status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating research' },
    )
  }
}

function notifyDiscord(
  research: ResearchItem,
  profile: DBProfile,
  siteUrl: string,
) {
  const title = research.title
  const slug = research.slug

  discordServiceServer.postWebhookRequest(
    `❓ ${profile.username} posted a new research: ${title}\nCheck it out here: <${siteUrl}/research/${slug}>`,
  )
}

async function isDuplicateSlug(slug: string, client: SupabaseClient) {
  const { data } = await client
    .from('research')
    .select('slug')
    .eq('slug', slug)
    .single()

  return !!data
}

async function uploadImages(
  researchId: number,
  uploadedImages: File[],
  client: SupabaseClient,
) {
  if (!uploadedImages || uploadedImages.length === 0) {
    return null
  }

  // const files = await Promise.all(uploadedImages.map(image => image.arrayBuffer()))

  const errors: string[] = []
  const images: { id: string; path: string; fullPath: string }[] = []

  for (const image of uploadedImages) {
    const result = await client.storage
      .from(process.env.TENANT_ID as string)
      .upload(`research/${researchId}/${image.name}`, image)

    if (result.data === null) {
      errors.push(`Error uploading image: ${image.name}`)
      continue
    }

    images.push(result.data)
  }

  return { images, errors }
}

function validateImages(images: File[]) {
  const errors: string[] = []
  for (const image of images) {
    if (!SUPPORTED_IMAGE_TYPES.includes(image.type)) {
      errors.push(`Unsupported image extension: ${image.type}`)
      continue
    }
  }

  return { valid: errors.length === 0, errors }
}

async function validateRequest(request: Request, user: User | null, data: any) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'POST') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!data.title) {
    return { status: 400, statusText: 'title is required' }
  }

  if (!data.description) {
    return { status: 400, statusText: 'description is required' }
  }

  return { valid: true }
}
