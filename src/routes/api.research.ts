import {
  and,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'
import { IModerationStatus } from 'oa-shared'
import { DB_ENDPOINTS } from 'src/models/dbEndpoints'
import { ResearchItem } from 'src/models/research.model'
import { ITEMS_PER_PAGE } from 'src/pages/Research/constants'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { discordServiceServer } from 'src/services/discordService.server'
import { firestore } from 'src/utils/firebase'
import { convertToSlug } from 'src/utils/slug'
import { SUPPORTED_IMAGE_EXTENSIONS } from 'src/utils/storage'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type {
  QueryFilterConstraint,
  QueryNonFilterConstraint,
} from 'firebase/firestore'
import type { IResearch, ResearchStatus } from 'oa-shared'
import type { DBProfile } from 'src/models/profile.model'
import type { ResearchSortOption } from 'src/pages/Research/ResearchSortOptions.ts'

// runs on the server
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const words: string[] =
    searchParams.get('words') != ''
      ? searchParams.get('words')?.split(',') ?? []
      : []
  const category: string | null = searchParams.get('category')
  const sort: ResearchSortOption = (searchParams.get('sort') ??
    'LatestUpdated') as ResearchSortOption
  const status: ResearchStatus | null = searchParams.get(
    'status',
  ) as ResearchStatus
  const lastDocId: string | null = searchParams.get('lastDocId')
  const drafts: boolean = searchParams.get('drafts') != undefined
  const userId: string | null = searchParams.get('userId')

  const { itemsQuery, countQuery } = await createSearchQuery(
    words,
    category,
    sort,
    status,
    lastDocId,
    ITEMS_PER_PAGE,
    drafts,
    userId,
  )

  const documentSnapshots = await getDocs(itemsQuery)
  const items = documentSnapshots.docs
    ? documentSnapshots.docs.map((x) => x.data() as IResearch.Item)
    : []

  let total: number | undefined = undefined
  // get total only if not requesting drafts
  if (!drafts || !userId)
    total = (await getCountFromServer(countQuery)).data().count

  return Response.json({ items, total })
}

const createSearchQuery = async (
  words: string[],
  category: string | null,
  sort: ResearchSortOption,
  status: ResearchStatus | null,
  lastDocId: string | null,
  page_size: number,
  drafts: boolean,
  userId: string | null,
) => {
  let filters: QueryFilterConstraint[] = []
  if (drafts && userId) {
    filters = [
      and(
        where('_createdBy', '==', userId),
        where('moderation', 'in', [
          IModerationStatus.AWAITING_MODERATION,
          IModerationStatus.DRAFT,
          IModerationStatus.IMPROVEMENTS_NEEDED,
          IModerationStatus.REJECTED,
        ]),
        where('_deleted', '!=', true),
      ),
    ]
  } else {
    filters = [
      and(
        where('_deleted', '!=', true),
        where('moderation', '==', IModerationStatus.ACCEPTED),
      ),
    ]
  }

  let constraints: QueryNonFilterConstraint[] = []

  const sortByField = getSortByField(sort)
  constraints = [orderBy(sortByField, 'desc')] // TODO - add sort by _id to act as a tie breaker

  if (words?.length > 0) {
    filters = [...filters, and(where('keywords', 'array-contains-any', words))]
  }

  if (category) {
    filters = [...filters, where('researchCategory._id', '==', category)]
  }

  if (status) {
    filters = [...filters, where('researchStatus', '==', status)]
  }

  const collectionRef = collection(firestore, DB_ENDPOINTS.research)
  const countQuery = query(collectionRef, and(...filters), ...constraints)

  // add pagination only to itemsQuery, not countQuery
  if (lastDocId) {
    const lastDocSnapshot = await getDoc(
      doc(collection(firestore, DB_ENDPOINTS.research), lastDocId),
    )

    if (!lastDocSnapshot.exists) {
      throw new Error('Document with the provided ID does not exist.')
    }
    const lastDocData = lastDocSnapshot.data() as IResearch.Item

    constraints.push(startAfter(lastDocData[sortByField])) // TODO - add startAfter by _id to act as a tie breaker
  }

  const itemsQuery = query(
    collectionRef,
    and(...filters),
    ...constraints,
    limit(page_size),
  )

  return { countQuery, itemsQuery }
}

const getSortByField = (sort: ResearchSortOption) => {
  switch (sort) {
    case 'MostComments':
      return 'totalCommentCount'
    case 'MostUpdates':
      return 'totalUpdates'
    case 'MostUseful':
      return 'totalUsefulVotes'
    case 'Newest':
      return '_created'
    case 'LatestUpdated':
      return '_contentModifiedTimestamp'
    default:
      return '_contentModifiedTimestamp'
  }
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
    if (!SUPPORTED_IMAGE_EXTENSIONS.includes(image.type)) {
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
