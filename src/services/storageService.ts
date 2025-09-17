import { getCleanFileName } from 'src/utils/storage'

import type { ContentType } from 'oa-shared'

const imageUpload = async (
  id: number | null,
  contentType: ContentType,
  imageFile: File,
) => {
  const body = new FormData()
  if (id) {
    body.append('id', id.toString())
  }
  body.append('contentType', contentType)
  body.append('imageFile', imageFile, getCleanFileName(imageFile.name))

  const response = await fetch(`/api/images`, {
    method: 'POST',
    body,
  })

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error uploading image', { cause: 500 })
  }

  const data: { image } = await response.json()
  return data.image
}

export const storageService = {
  imageUpload,
}
