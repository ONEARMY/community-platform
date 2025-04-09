import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { ActionFunctionArgs } from 'react-router'

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { client, headers } = createSupabaseServerClient(request)
    const formData = await request.formData()

    const data = {
      action_type: formData.get('actionType') as string,
      content_type: formData.get('contentType') as string,
      source_id: formData.get('sourceId') as string,
      triggered_by_id: formData.get('triggeredBy') as string,
    }

    const response = await client
      .from('notifications')
      .insert({
        ...data,
        read: false,
        tenant_id: process.env.TENANT_ID!,
      })
      .select()

    if (response.error || !response.data) {
      throw response.error || 'No data returned'
    }

    return Response.json(null, { headers, status: 201 })
  } catch (error) {
    console.log(error)

    return Response.json(
      { error },
      { status: 500, statusText: 'Error creating notification' },
    )
  }
}
