import { Image } from 'oa-shared'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { ContentType, DBImage } from 'oa-shared'
import type { ImageSize } from 'src/config/imageTransforms'

const getImagesPublicUrls = async (
  client: SupabaseClient,
  images: DBImage[] | null,
  size?: ImageSize,
) => {
  if (!images || images.length === 0) {
    return []
  }

  const imageList: Image[] = []

  for await (const image of images) {
    const response = client.storage
      .from(process.env.TENANT_ID as string)
      .getPublicUrl(image.path, size ? { transform: size } : undefined)
    imageList.push(
      new Image({ id: image.id, publicUrl: response.data.publicUrl }),
    )
  }

  return imageList
}

const setUploadImage = async (
  client: SupabaseClient,
  id: number,
  uploadedImageFile: File | null,
  existingImageFile?: File | null,
) => {
  if (!uploadedImageFile && !!existingImageFile) {
    return existingImageFile
  }

  if (!uploadedImageFile) {
    return await client
      .from('news')
      .update({ hero_image: null })
      .eq('id', id)
      .select()
  }

  const uploadedImage = await storageServiceServer.uploadImage(
    id,
    uploadedImageFile,
    client,
    'news',
  )
  const image =
    uploadedImage?.image && !uploadedImage.error ? uploadedImage.image : null

  if (uploadedImage?.error) {
    console.error(uploadedImage?.error.message)
    return null
  }

  const updateResult = await client
    .from('news')
    .update({ hero_image: image })
    .eq('id', id)
    .select()

  if (!updateResult.data) {
    return null
  }

  return updateResult.data[0].image
}

const uploadImage = async (
  id: number,
  uploadedImage: File,
  client: SupabaseClient,
  table: ContentType,
) => {
  if (!uploadedImage) {
    return null
  }
  const response = await client.storage
    .from(process.env.TENANT_ID as string)
    .upload(`${table}/${id}/${uploadedImage.name}`, uploadedImage)

  const image = response.data
  const error =
    image === null
      ? new Error(`Uploading image: ${response.error.message}`)
      : null

  return { image, error }
}

export const storageServiceServer = {
  getImagesPublicUrls,
  setUploadImage,
  uploadImage,
}
