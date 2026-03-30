import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBQuestion, Question } from 'oa-shared';
import { ImageServiceServer } from './imageService.server';

export class QuestionServiceServer {
  constructor(private client: SupabaseClient) {}

  async getById(id: number): Promise<DBQuestion> {
    const result = await this.client.from('questions').select().eq('id', id).single();
    return result.data as DBQuestion;
  }

  async getBySlug(slug: string) {
    return this.client
      .from('questions')
      .select(
        `
         id,
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
      .or(`slug.eq.${slug},previous_slugs.cs.{"${slug}"}`)
      .or('deleted.eq.false,deleted.is.null')
      .single();
  }

  async getQuestionsByUser(username: string): Promise<Partial<Question>[]> {
    const imageService = new ImageServiceServer(this.client);
    const functionResult = await this.client.rpc('get_user_questions', {
      username_param: username,
    });

    if (functionResult.error || functionResult.count === 0) {
      console.error('Error fetching user questions:', functionResult.error);
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
