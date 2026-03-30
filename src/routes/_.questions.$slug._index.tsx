import type { DBQuestion } from 'oa-shared';
import { Question } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { data, useLoaderData } from 'react-router';
import { IMAGE_SIZES } from 'src/config/imageTransforms';
import { CommentFactory } from 'src/factories/commentFactory.server';
import { NotFoundPage } from 'src/pages/NotFound/NotFound';
import { QuestionPage } from 'src/pages/Question/QuestionPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ImageServiceServer } from 'src/services/imageService.server';
import { QuestionServiceServer } from 'src/services/questionService.server';
import { StorageServiceServer } from 'src/services/storageService.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';
import { ContentServiceServer } from '../services/contentService.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const result = await new QuestionServiceServer(client).getBySlug(params.slug!);

  const tenantSettings = await new TenantSettingsService(client).get();

  if (result.error || !result.data) {
    return data({ question: null, tenantSettings }, { headers });
  }

  const dbQuestion = result.data as unknown as DBQuestion;

  const contentService = new ContentServiceServer(client);

  if (dbQuestion.id) {
    await contentService.incrementViewCount('questions', dbQuestion.total_views, dbQuestion.id);
  }

  const [usefulVotes, subscribers, tags] = await contentService.getMetaFields(
    dbQuestion.id,
    'questions',
    dbQuestion.tags,
  );

  const images = new StorageServiceServer(client).getPublicUrls(
    dbQuestion.images!,
    IMAGE_SIZES.GALLERY,
  );

  const question = Question.fromDB(dbQuestion, tags, images);
  question.usefulCount = usefulVotes.count || 0;
  question.subscriberCount = subscribers.count || 0;

  if (dbQuestion.author) {
    const factory = new CommentFactory(new ImageServiceServer(client));
    question.author = await factory.createAuthor(dbQuestion.author);
  }

  return data({ question, tenantSettings }, { headers });
}

export const meta = mergeMeta<typeof loader>(({ loaderData }) => {
  const question = (loaderData as any)?.question as Question;

  if (!question) {
    return [];
  }

  const title = `${question.title} - Question - ${loaderData?.tenantSettings.siteName}`;
  const imageUrl = question.images?.at(0)?.publicUrl;

  return generateTags(title, question.description, imageUrl);
});

export default function Index() {
  const data = useLoaderData<typeof loader>();

  if (!data.question) {
    return <NotFoundPage />;
  }

  return <QuestionPage question={data.question} />;
}
