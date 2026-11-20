import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, DBQuestion, Question, QuestionDTO } from 'oa-shared';
import { logger } from 'src/logger';
import {
  QUESTION_MAX_LINKS,
  QUESTION_MAX_PER_DAY,
  QUESTION_MAX_PER_MONTH,
} from 'src/pages/Question/constants';
import { escapeFilterValue } from 'src/utils/helpers';
import { tooManyRequestsError, validationError } from 'src/utils/httpException';
import { ImageServiceServer } from './imageService.server';

export class QuestionServiceServer {
  constructor(private client: SupabaseClient<Database>) {}

  static validateNotSpam(data: Pick<QuestionDTO, 'title' | 'description'>) {
    const text = `${data.title} ${data.description}`;
    const linkCount = (text.match(/https?:\/\//g) || []).length;

    if (linkCount > QUESTION_MAX_LINKS) {
      throw validationError('This question looks like spam. Please rephrase and try again.');
    }
  }

  async checkRateLimit(profileId: number) {
    const dayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const monthAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

    const [dayCount, monthCount] = await Promise.all([
      this.client
        .from('questions')
        .select('id', { count: 'exact' })
        .eq('created_by', profileId)
        .gt('created_at', dayAgo.toISOString()),
      this.client
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

  async getById(id: number): Promise<DBQuestion> {
    const result = await this.client.from('questions').select().eq('id', id).single();
    return result.data as DBQuestion;
  }

  async getBySlug(slug: string) {
    const escapedSlug = escapeFilterValue(slug);
    const escapedArraySlug = escapeFilterValue(escapedSlug);

    return this.client
      .from('questions')
      .select(
        `
         id,
         accepted_answer_id,
         accepted_answer_date,
         created_at,
         created_by,
         is_draft,
         modified_at,
         published_at,
         comment_count,
         description,
         moderation,
         slug,
         category:category(id,name),
         tags,
         title,
         total_views,
         images,
         author:profiles(id, display_name, username, photo, country, badges:profile_badges_relations(
            profile_badges(
              id,
              name,
              display_name,
              image_url,
              action_url
            )
          ))
       `,
      )
      .or(`slug.eq."${escapedSlug}",previous_slugs.cs."{\\"${escapedArraySlug}\\"}"`)
      .or('deleted.eq.false,deleted.is.null')
      .single();
  }

  async getQuestionsByUser(username: string): Promise<Partial<Question>[]> {
    const imageService = new ImageServiceServer(this.client);
    const functionResult = await this.client.rpc('get_user_questions', {
      username_param: username,
    });

    if (functionResult.error || functionResult.count === 0) {
      logger.error('Error fetching user questions:', functionResult.error);
      return [];
    }

    const items = functionResult.data.map((x) => {
      const images = x.images ? imageService.getPublicUrls(x.images) : null;
      return {
        id: x.id,
        commentCount: x.comment_count,
        images,
        title: x.title,
        slug: x.slug,
        usefulCount: x.total_useful,
      };
    });

    return items;
  }
}
