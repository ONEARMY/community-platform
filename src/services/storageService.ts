const imageUpload = async (id, contentType, imageFile) => {
  const body = new FormData()
  body.append('id', id)
  body.append('contentType', contentType)
  body.append('imageFile', imageFile, imageFile.name)

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
