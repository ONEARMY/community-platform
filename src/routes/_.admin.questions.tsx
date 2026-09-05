import type { DBQuestion } from 'oa-shared';
import { Question } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { QuestionsPage } from 'src/pages/Admin/Questions/QuestionsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';

export const handle = { breadcrumb: 'Questions' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const { data } = await client
    .from('questions')
    .select(
      'title,slug,created_by,category,tags,moderation,is_draft,published_at,comment_count,deleted,total_views,id,images',
    )
    .order('published_at', { ascending: true });

  const questions = (data || []).map((question) =>
    Question.fromDB(question as DBQuestion, question.tags, question.images),
  );

  return { questions };
}

export default function Index() {
  const { questions } = useLoaderData<typeof loader>();

  return <QuestionsPage questions={questions} />;
}
