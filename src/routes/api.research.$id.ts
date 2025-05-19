import { ResearchItem, UserRole } from 'oa-shared'
import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { contentServiceServer } from 'src/services/contentService.server'
import { profileServiceServer } from 'src/services/profileService.server'
import { researchServiceServer } from 'src/services/researchService.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { convertToSlug } from 'src/utils/slug'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'
import type { DBProfile, DBResearchItem } from 'oa-shared'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const id = Number(params.id)

    if (request.method === 'DELETE') {
      return await deleteResearch(request, id)
    }

    const formData = await request.formData()
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.has('category')
        ? Number(formData.get('category'))
        : null,
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
      collaborators: formData.has('collaborators')
        ? (formData.getAll('collaborators') as string[])
        : null,
      isDraft: formData.get('draft') === 'true',
    }
    const uploadedImage = formData.get('image') as File
    const existingImage = formData.get('existingImage') as string | null

    const { client, headers } = createSupabaseServerClient(request)

    const {
      data: { user },
    } = await client.auth.getUser()

    const currentUserProfile = await profileServiceServer.getByAuthId(
      user?.id || '',
      client,
    )
    const currentResearch = await researchServiceServer.getById(id, client)

    const { valid, status, statusText } = await validateRequest(
      request,
      user,
      data,
      currentUserProfile,
      currentResearch,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const newSlug = convertToSlug(data.title)

    if (
      currentResearch.slug !== newSlug &&
      (await contentServiceServer.isDuplicateExistingSlug(
        newSlug,
        currentResearch.id,
        client,
        'research',
      ))
    ) {
      return Response.json(
        {},
        {
          status: 409,
          statusText: 'This research already exists',
        },
      )
    }

    let previousSlugs = currentResearch.previous_slugs
    if (currentResearch.slug !== newSlug) {
      previousSlugs = previousSlugs
        ? [...previousSlugs, currentResearch.slug]
        : [currentResearch.slug]
    }

    const researchResult = await client
      .from('research')
      .update({
        title: data.title,
        description: data.description,
        slug: newSlug,
        category: data.category,
        tags: data.tags,
        previous_slugs: previousSlugs,
        is_draft: data.isDraft,
        collaborators: data.collaborators,
        ...(!existingImage && { image: null }),
      })
      .eq('id', id)
      .select()

    if (researchResult.error || !researchResult.data) {
      throw researchResult.error
    }

    const research = ResearchItem.fromDB(researchResult.data[0], [])

    if (uploadedImage) {
      const mediaResult = await storageServiceServer.uploadImage(
        [uploadedImage],
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
          const [image] = storageServiceServer.getPublicUrls(
            client,
            result.data,
          )

          research.image = image
        }
      }
    }

    return Response.json({ research }, { headers, status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating research' },
    )
  }
}

async function deleteResearch(request, id: number) {
  const { client, headers } = createSupabaseServerClient(request)

  const {
    data: { user },
  } = await client.auth.getUser()

  const canEdit = await researchServiceServer.isAllowedToEditResearchById(
    client,
    id,
    user?.user_metadata.username,
  )

  if (canEdit) {
    await client
      .from('research')
      .update({
        deleted: true,
      })
      .eq('id', id)

    return Response.json({}, { status: 200, headers })
  }

  return Response.json({}, { status: 500, headers })
}

async function validateRequest(
  request: Request,
  user: User | null,
  data: any,
  profile: DBProfile | null,
  research: DBResearchItem,
) {
  if (!user) {
    return { status: 401, statusText: 'unauthorized' }
  }

  if (request.method !== 'PUT') {
    return { status: 405, statusText: 'method not allowed' }
  }

  if (!data.title) {
    return { status: 400, statusText: 'title is required' }
  }

  if (!data.description) {
    return { status: 400, statusText: 'description is required' }
  }

  if (!profile) {
    return { status: 400, statusText: 'invalid user' }
  }

  if (profile.roles?.includes(UserRole.ADMIN)) {
    return { valid: true }
  }

  if (
    research.author?.id !== profile.id &&
    !research.collaborators?.includes(profile.username)
  ) {
    return { status: 403, statusText: 'forbidden' }
  }

  return { valid: true }
}
