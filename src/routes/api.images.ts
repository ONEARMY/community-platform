import { createSupabaseServerClient } from 'src/repository/supabase.server'
import { storageServiceServer } from 'src/services/storageService.server'
import { validateImage } from 'src/utils/storage'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { ContentType } from 'oa-shared'

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request)

  try {
    const formData = await request.formData()
    const contentType = formData.get('contentType') as ContentType
    const imageFile = formData.get('imageFile') as File
    const id = formData.has('id') ? Number(formData.get('id') as string) : null

    const claims = await client.auth.getClaims()

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 })
    }

    const { valid, status, statusText } = await validateRequest(
      request,
      imageFile,
    )

    if (!valid) {
      return Response.json({}, { status, statusText, headers })
    }

    const uploadedImage = await storageServiceServer.uploadImage(
      [imageFile],
      `${id ? contentType : 'users'}/${id ?? claims.data.claims.sub}`,
      client,
    )

    if (uploadedImage?.errors && uploadedImage?.errors.length > 0) {
      throw uploadedImage?.errors
    }

    const [image] = storageServiceServer.getPublicUrls(
      client,
      uploadedImage!.media,
    )

    return Response.json({ image }, { headers })
  } catch (error) {
    console.error(error)
    return Response.json(
      {},
      { headers, status: 500, statusText: 'Error uploading image' },
    )
  }
}

async function validateRequest(request: Request, imageFile: File) {
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
