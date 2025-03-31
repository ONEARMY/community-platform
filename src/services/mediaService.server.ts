import type { SupabaseClient } from '@supabase/supabase-js'

const uploadMedia = async (
  files: File[],
  path: string,
  client: SupabaseClient,
) => {
  if (!files || files.length === 0) {
    return null
  }

  const errors: string[] = []
  const media: { id: string; path: string; fullPath: string }[] = []

  for (const file of files) {
    const result = await client.storage
      .from(process.env.TENANT_ID as string)
      .upload(`${path}/${file.name}`, file)

    if (result.data === null) {
      errors.push(`Error uploading file: ${file.name}`)
      continue
    }

    media.push(result.data)
  }

  return { media, errors }
}
export const mediaServiceServer = {
  uploadMedia,
}
