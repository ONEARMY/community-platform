import type { SupabaseClient } from '@supabase/supabase-js';
import { DBQuestion, UserRole } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, redirect, useLoaderData } from 'react-router';
import { QuestionForm } from 'src/pages/Question/Content/Common/QuestionForm';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { questionServiceServer } from 'src/services/questionService.server';
import { redirectServiceServer } from 'src/services/redirectService.server';
import { StorageServiceServer } from 'src/services/storageService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return redirectServiceServer.redirectSignIn(`/questions/${params.slug}/edit`, headers);
  }

  if (!params.slug) {
    return data({ formData: null, id: null }, { headers });
  }

  const result = await questionServiceServer.getBySlug(client, params.slug!);

  if (result.error || !result.data) {
    return data({ formData: null, id: null }, { headers });
  }

  const dbQuestion = result.data as unknown as DBQuestion;

  if (!(await isUserAllowedToEdit(dbQuestion, claims.data.claims.sub, client))) {
    return redirect('/forbidden?page=question-edit', { headers });
  }

  const publicImages = dbQuestion?.images
    ? new StorageServiceServer(client).getPublicUrls(dbQuestion?.images)
    : [];

  const formData = DBQuestion.toFormData(dbQuestion, publicImages);

  return data({ formData, id: dbQuestion.id }, { headers });
}

async function isUserAllowedToEdit(
  dbQuestion: DBQuestion,
  userAuthId: string,
  client: SupabaseClient,
) {
  const profileResult = await client
    .from('profiles')
    .select('id,roles')
    .eq('auth_id', userAuthId)
    .single();

  return (
    profileResult.data?.roles?.includes(UserRole.ADMIN) ||
    profileResult.data?.id === dbQuestion.author?.id
  );
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <QuestionForm
      data-testid="question-create-form"
      formAction="edit"
      formData={data.formData}
      id={data.id}
    />
  );
}
