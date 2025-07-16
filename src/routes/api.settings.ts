import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { ActionFunctionArgs } from '@remix-run/node'
import type { User } from '@supabase/supabase-js'

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData()
    const data = {
      title: formData.get('displayName') as string,
      about: formData.get('about') as string,
      type: formData.get('type') as string,
      country: formData.get('country') as string,
      links: formData.get('links') as string,
      isContactable: formData.get('isContactable') === 'true',
      showVisitorPolicy: formData.get('showVisitorPolicy') === 'true',
      visitorPolicy: formData.get('visitorPolicy') as string,
      visitorStatus: formData.get('visitorStatus') as string,
      tags: formData.has('tags')
        ? formData.getAll('tags').map((x) => Number(x))
        : null,
      existingImageId: (formData.get('existingImageId') as string) || null,
      existingCoverImageIds:
        (formData.getAll('existingCoverImageIds') as string[]) || null,
      image: (formData.get('image') as File | null) || null,
      coverImages: (formData.getAll('coverImages') as File[] | null) || null,
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
    return Response.json({}, { headers, status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error creating research' },
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

  if (!data.displayName) {
    return { status: 400, statusText: 'displayName is required' }
  }

  if (!data.type) {
    return { status: 400, statusText: 'type is required' }
  }

  if (!data.existingImageId && !data.image) {
    return { status: 400, statusText: 'image is required' }
  }

  if (data.type !== 'member') {
    if (
      (!data.existingCoverImageIds ||
        data.existingCoverImageIds.length === 0) &&
      (!data.coverImages || data.coverImages.length === 0)
    ) {
      return { status: 400, statusText: 'cover images are required' }
    }

    if (data.showVisitorPolicy && !data.visitorPolicy) {
      return { status: 400, statusText: 'visitor policy is required' }
    }
  }

  return { valid: true }
}
