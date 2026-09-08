// TODO: split this in separate files once we update remix to NOT use file-based routing

import { HTTPException } from 'hono/http-exception';
import type { DBMedia, DBProfile, DBQuestion, Moderation, QuestionDTO } from 'oa-shared';
import { Question } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { logger } from 'src/logger';
import {
  ITEMS_PER_PAGE,
  QUESTION_MAX_LINKS,
  QUESTION_MAX_PER_DAY,
  QUESTION_MAX_PER_MONTH,
} from 'src/pages/Question/constants';
import type { QuestionSortOption } from 'src/pages/Question/QuestionSortOptions';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ContentServiceServer } from 'src/services/contentService.server';
import { discordServiceServer } from 'src/services/discordService.server';
import { ImageServiceServer } from 'src/services/imageService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { SubscribersServiceServer } from 'src/services/subscribersService.server';
import {
  conflictError,
  methodNotAllowedError,
  tooManyRequestsError,
  validationError,
} from 'src/utils/httpException';
import { convertToSlug } from 'src/utils/slug';

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const q = params.get('q');
  const category = Number(params.get('category')) || undefined;
  const sort = params.get('sort') as QuestionSortOption;
  const skip = Number(params.get('skip')) || 0;

  const { client, headers } = createSupabaseServerClient(request);

  const { data, error } = await client.rpc('get_questions', {
    search_query: q || null,
    category_id: category,
    sort_by: sort,
    offset_val: skip,
    limit_val: ITEMS_PER_PAGE,
  });

  const countResult = await client.rpc('get_questions_count', {
    search_query: q || null,
    category_id: category,
  });

  if (error) {
    logger.error(error);
    return Response.json({}, { status: 500, headers });
  }

  const total = countResult.data || 0;

  const dbItems = data as DBQuestion[];

  if (!dbItems || dbItems.length === 0) {
    return Response.json({ items: [], total: 0 }, { headers });
  }

  const imageService = new ImageServiceServer(client);

  const items = dbItems.map((x) => {
    const question = Question.fromDB(x, [], []);

    if (question.author && x.author?.photo) {
      question.author.photo = imageService.getPublicUrl(x.author.photo) ?? null;
    }

    return question;
  });

  if (items && items.length > 0) {
    // Populate useful votes
    const votes = await client.rpc('get_useful_votes_count_by_content_id', {
      p_content_type: 'questions',
      p_content_ids: items.map((x) => x.id),
    });

    if (votes.data) {
      const votesByContentId = votes.data.reduce((acc, current) => {
        acc.set(current.content_id, current.count);
        return acc;
      }, new Map());

      for (const item of items) {
        if (votesByContentId.has(item.id)) {
          item.usefulCount = votesByContentId.get(item.id)!;
        }
      }
    }
  }

  return Response.json({ items, total }, { headers });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const formData = await request.formData();

    if (formData.get('website')) {
      throw validationError('Invalid request');
    }

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      isDraft: formData.get('isDraft') === 'true',
      category: formData.has('category') ? Number(formData.get('category')) : null,
      tags: formData.has('tags') ? formData.getAll('tags').map((x) => Number(x)) : null,
      images: formData.has('images')
        ? formData.getAll('images').map((x) => JSON.parse(x as string) as DBMedia)
        : null,
    } satisfies QuestionDTO;

    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({}, { headers, status: 401 });
    }
    await validateRequest(request, data);

    const slug = convertToSlug(data.title);

    if (await new ContentServiceServer(client).isDuplicateNewSlug(slug, 'questions')) {
      throw conflictError('This question already exists');
    }

    const profileRequest = await client
      .from('profiles')
      .select('id,username')
      .eq('auth_id', claims.data.claims.sub)
      .limit(1);

    if (profileRequest.error || !profileRequest.data?.at(0)) {
      logger.error({ error: profileRequest.error });
      throw validationError('User not found');
    }

    const profile = profileRequest.data[0] as DBProfile;

    if (!profile.username) {
      throw validationError('You must set a username before creating content', 'username');
    }

    if (!data.isDraft) {
      await checkRateLimit(client, profile.id);
    }

    const questionResult = await client
      .from('questions')
      .insert({
        created_by: profile.id,
        title: data.title,
        description: data.description,
        is_draft: data.isDraft,
        moderation: 'accepted' as Moderation,
        images: data.images,
        published_at: data.isDraft ? null : new Date(),
        slug,
        category: data.category,
        tags: data.tags,
        tenant_id: process.env.TENANT_ID,
      })
      .select();

    if (questionResult.error || !questionResult.data) {
      throw new Error(questionResult.error?.details || 'Error creating question');
    }

    const question = Question.fromDB(questionResult.data[0], []);
    new SubscribersServiceServer(client).add('questions', question.id, profile.id);

    if (!question.isDraft) {
      notifyDiscord(question, profile, new URL(request.url).origin.replace('http:', 'https:'));
    }

    new ProfileServiceServer(client).updateUserActivity(claims.data.claims.sub);

    return Response.json({ question }, { headers, status: 201 });
  } catch (error) {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    logger.error(error);

    return Response.json({ error: 'Error creating question' }, { headers, status: 500 });
  }
};

function notifyDiscord(question: Question, profile: DBProfile, siteUrl: string) {
  const title = question.title;
  const slug = question.slug;

  if (!profile?.username) {
    console.warn(`Profile ${profile?.id} has no username, skipping Discord notification`);
    return;
  }

  discordServiceServer.postWebhookRequest(
    `❓ ${profile.username} has a new question: ${title}\nHelp them out and answer here: <${siteUrl}/questions/${slug}>`,
  );
}

async function checkRateLimit(
  client: ReturnType<typeof createSupabaseServerClient>['client'],
  profileId: number,
) {
  const dayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const monthAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

  const [dayCount, monthCount] = await Promise.all([
    client
      .from('questions')
      .select('id', { count: 'exact' })
      .eq('created_by', profileId)
      .gt('created_at', dayAgo.toISOString()),
    client
      .from('questions')
      .select('id', { count: 'exact' })
      .eq('created_by', profileId)
      .gt('created_at', monthAgo.toISOString()),
  ]);

  if (dayCount.count! >= QUESTION_MAX_PER_DAY) {
    throw tooManyRequestsError(
      "You've posted a lot of questions today! To protect the platform from spam we haven't posted this one.",
    );
  }

  if (monthCount.count! >= QUESTION_MAX_PER_MONTH) {
    throw tooManyRequestsError(
      "You've reached the monthly limit for new questions. To protect the platform from spam we haven't posted this one.",
    );
  }
}

function isLikelySpam(data: QuestionDTO): boolean {
  const text = `${data.title} ${data.description}`;
  const linkCount = (text.match(/https?:\/\//g) || []).length;
  return linkCount > QUESTION_MAX_LINKS;
}

async function validateRequest(request: Request, data: QuestionDTO) {
  if (request.method !== 'POST') {
    throw methodNotAllowedError();
  }

  if (!data.title) {
    throw validationError('Title is required', 'title');
  }

  if (!data.description) {
    throw validationError('Description is required', 'description');
  }

  if (isLikelySpam(data)) {
    throw validationError('This question looks like spam. Please rephrase and try again.');
  }
}
