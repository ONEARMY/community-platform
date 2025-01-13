import { verifyFirebaseToken } from 'src/firestore/firestoreAdmin.server'
import { createSupabaseServerClient } from 'src/repository/supabase.server'

import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { valid, error, user_id } = await verifyFirebaseToken(
    request.headers.get('firebaseToken')!,
  )

  if (!valid) {
    console.error(error)
    return Response.json({}, { status: 401, statusText: 'unauthorized' })
  }

  const { client, headers } = createSupabaseServerClient(request)

  const subcribedResult = await client
    .from('useful_votes')
    .select('id, profiles!inner(id)', { count: 'exact' })
    .eq('content_id', params.contentId)
    .eq('content_type', params.contentType)
    .eq('profiles.firebase_auth_id', user_id)

  const voted = subcribedResult.count === 1

  return Response.json({ voted }, { headers, status: 200 })
}
