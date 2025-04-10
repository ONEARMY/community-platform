import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { validateImage } from 'src/utils/helpers'

import type { User } from '@supabase/supabase-js'
import type { ContentType } from 'oa-shared'
import type { LoaderFunctionArgs } from 'react-router'

export const action = async ({ request }: LoaderFunctionArgs) => {
  try {
    const formData = await request.formData()
    const contentType = formData.get('contentType') as ContentType
    const imageFile = formData.get('imageFile') as File
    const id = formData.has('id') ? Number(formData.get('id') as string) : null

    const { client, headers } = createSupabaseServerClient(request)

    const {
      data: { user },
    } = await client.auth.getUser()

    const { valid, status, statusText } = await validateRequest(
      user,
      request,
      imageFile,
    )

    if (!valid) {
      return Response.json({}, { status, statusText })
    }

    const uploadedImage = await storageServiceServer.uploadImage(
      id || user?.id || 0,
      imageFile,
      client,
      id ? contentType : 'users',
    )

    const image =
      uploadedImage?.image &&
      storageServiceServer.getImagePublicUrl(client, uploadedImage.image)

    if (uploadedImage?.error) {
      throw uploadedImage?.error.message
    }

    return Response.json({ image }, { headers })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { status: 500, statusText: 'Error uploading image' },
    )
  }
}

async function validateRequest(
  user: User | null,
  request: Request,
  imageFile: File,
) {
  if (!user) {
    return { status: 401, statusText: 'Unauthorized' }
  }

  if (request.method !== 'POST') {
    return { status: 405, statusText: 'Method not allowed' }
  }

  const { valid, error } = validateImage(imageFile)
  if (!valid && error) {
    return {
      status: 400,
      statusText: error.message,
    }
  }

  return { valid: true }
}
