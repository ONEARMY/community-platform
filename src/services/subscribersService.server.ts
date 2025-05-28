import type { SupabaseClient } from '@supabase/supabase-js'
import type { SubscribableContentTypes } from 'oa-shared'

const add = async (
  contentType: SubscribableContentTypes,
  contentId: number,
  profileId: number,
  client: SupabaseClient,
) => {
  try {
    const response = await client
      .from('subscribers')
      .select('*')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .eq('user_id', profileId)
      .single()

    if (response.data) {
      return Response.json({}, { status: 200 })
    }

    await client.from('subscribers').insert({
      content_type: contentType,
      content_id: contentId,
      user_id: profileId,
      tenant_id: process.env.TENANT_ID!,
    })

    return Response.json({}, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({}, { status: 500, statusText: 'error' })
  }
}

export const subscribersServiceServer = {
  add,
}
