import { type DBProject, Project } from 'oa-shared'
import { IMAGE_SIZES } from 'src/config/imageTransforms'
import { ITEMS_PER_PAGE } from 'src/pages/Library/constants'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { contentServiceServer } from 'src/services/contentService.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { convertToSlug } from 'src/utils/slug'

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'
import type { LibrarySortOption } from 'src/pages/Library/Content/List/LibrarySortOptions'

// runs on the server
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  const q = searchParams.get('q')
  const category = Number(searchParams.get('category')) || undefined
  const sort = searchParams.get('sort') as LibrarySortOption
  const skip = Number(searchParams.get('skip')) || 0

  const { client, headers } = createSupabaseServerClient(request)

  const { data, error } = await client.rpc('get_research', {
    search_query: q || null,
    category_id: category,
    sort_by: sort,
    offset_val: skip,
    limit_val: ITEMS_PER_PAGE,
  })

  const countRersult = await client.rpc('get_research_count', {
    search_query: q || null,
    category_id: category,
    research_status: status || null,
  })
  const count = countRersult.data || 0

  if (error) {
    console.error(error)
    return Response.json({}, { status: 500, headers })
  }

  const dbItems = data as DBProject[]
  const items = dbItems.map((x) => {
    const images = x.cover_image
      ? storageServiceServer.getPublicUrls(
          client,
          [x.cover_image],
          IMAGE_SIZES.LIST,
        )
      : []
    return Project.fromDB(x, [], images)
  })

  if (items && items.length > 0) {
    // Populate useful votes
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'project',
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
      isDraft: formData.get('draft') === 'true',
      category: formData.has('category')
        ? (formData.get('category') as string)
        : null,
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
    }
    const uploadedImage = formData.get('coverImage') as File | null

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

    if (
      await contentServiceServer.isDuplicateNewSlug(slug, client, 'projects')
    ) {
      return Response.json(
        {},
        {
          status: 409,
          statusText: 'This project already exists',
        },
      )
    }

    const profile = await profileServiceServer.getByAuthId(user!.id, client)

    if (!profile) {
      return Response.json({}, { status: 400, statusText: 'User not found' })
    }

    const projectResult = await client
      .from('projects')
      .insert({
        created_by: profile.id,
        title: data.title,
        description: data.description,
        slug,
        category: data.category,
        tags: data.tags,
        is_draft: data.isDraft,
        steps: data.steps,
        file_link: data.fileLink,
        tenant_id: process.env.TENANT_ID,
      })
      .select()

    if (projectResult.error || !projectResult.data) {
      throw projectResult.error
    }

    const project = Project.fromDB(projectResult.data[0], [])

    if (uploadedImage) {
      const mediaResult = await storageServiceServer.uploadImage(
        [uploadedImage],
        `projects/${project.id}`,
        client,
      )

      if (mediaResult?.errors) {
        console.error(mediaResult.errors)
      }

      if (mediaResult?.media && mediaResult.media.length > 0) {
        const result = await client
          .from('projects')
          .update({ image: mediaResult.media[0] })
          .eq('id', project.id)
          .select()

        if (result.data) {
          project.coverImage = result.data[0].image
        }
      }
    }

    return Response.json({ project }, { headers, status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating project' },
    )
  }
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
