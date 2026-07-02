import type { DBProfile } from 'oa-shared';
import { data, type LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { isUserAdmin } from 'src/utils/isAdmin';

export async function action({ params, request }: LoaderFunctionArgs) {
  const questionId = params.id ? Number(params.id) : null;

  if (!questionId) {
    return data({}, { status: 400, statusText: 'Question ID is required' });
  }

  if (request.method !== 'POST') {
    return data({}, { status: 405, statusText: 'method not allowed' });
  }

  const supabase = createSupabaseServerClient(request);
  const headers = supabase.headers;
  const claims = await supabase.client.auth.getClaims();

  if (!claims.data?.claims) {
    return data({}, { headers, status: 401 });
  }

  const profile = await getProfileByAuthId(request, claims.data.claims.sub);

  if (!profile) {
    return data({}, { headers, status: 400, statusText: 'user not found' });
  }

  try {
    const json = await request.json();
    const { acceptedAnswerId } = json as { acceptedAnswerId?: number };

    // Get the question to verify ownership
    const { data: questionData, error: questionError } = await supabase.client
      .from('questions')
      .select('created_by')
      .eq('id', questionId)
      .single();

    if (questionError || !questionData) {
      return data({}, { headers, status: 404, statusText: 'question not found' });
    }

    // Only the question author or admins can mark answers as accepted
    if (questionData.created_by !== profile.id && !isUserAdmin(profile)) {
      return data({}, { headers, status: 403, statusText: 'forbidden' });
    }

    // If acceptedAnswerId is provided, verify the comment exists and belongs to this question
    if (acceptedAnswerId) {
      const { data: commentData, error: commentError } = await supabase.client
        .from('comments')
        .select('id')
        .eq('id', acceptedAnswerId)
        .eq('source_id', questionId)
        .eq('source_type', 'questions')
        .single();

      if (commentError || !commentData) {
        return data({}, { headers, status: 404, statusText: 'comment not found' });
      }
    }

    // Update the question with the accepted answer
    const acceptedAnswerDate = acceptedAnswerId ? new Date().toISOString() : null;

    const { error: updateError } = await supabase.client
      .from('questions')
      .update({
        accepted_answer_id: acceptedAnswerId || null,
        accepted_answer_date: acceptedAnswerDate,
      })
      .eq('id', questionId);

    if (updateError) {
      console.error(updateError);
      return data({}, { headers, status: 500, statusText: 'Error updating accepted answer' });
    }

    new ProfileServiceServer(supabase.client).updateUserActivity(profile.auth_id);

    return data({ success: true }, { headers, status: 200 });
  } catch (error) {
    console.error(error);
    return data({}, { headers, status: 500, statusText: 'Internal server error' });
  }
}

async function getProfileByAuthId(request: Request, authId: string) {
  const { client } = createSupabaseServerClient(request);

  const { data: profileData, error } = await client
    .from('profiles')
    .select()
    .eq('auth_id', authId)
    .limit(1);

  if (error || !profileData?.at(0)) {
    return null;
  }

  return profileData[0] as DBProfile;
}
