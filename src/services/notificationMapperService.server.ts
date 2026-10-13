import { SupabaseClient } from '@supabase/supabase-js';
import { type Database, DBNotification, News, Notification, NotificationDisplay } from 'oa-shared';
import { logger } from 'src/logger';
import { NewsServiceServer } from './newsService.server';
import { TagsServiceServer } from './tagsService.server';

export class NotificationMapperServiceServer {
  constructor(private client: SupabaseClient<Database>) {}

  async transformNotification(dbNotification: DBNotification) {
    try {
      const notification = Notification.fromDB(dbNotification);

      if (notification.triggeredBy && dbNotification.triggered_by?.photo) {
        const { data } = this.client.storage
          .from(process.env.TENANT_ID as string)
          .getPublicUrl(dbNotification.triggered_by.photo.path);
        if (data?.publicUrl) {
          notification.triggeredBy.photo = {
            id: dbNotification.triggered_by.photo.id,
            path: dbNotification.triggered_by.photo.path,
            fullPath: dbNotification.triggered_by.photo.fullPath,
            publicUrl: data.publicUrl,
          };
        }
      }

      const content = await this.client
        .from(notification.contentType)
        .select('*')
        .eq('id', notification.contentId)
        .single();

      if (content.data) {
        notification.content = content.data as unknown as Notification['content'];
      } else {
        throw Error('Content not found, probably deleted');
      }

      if (notification.content) {
        if ('hero_image' in content.data && content.data.hero_image) {
          const heroImage = await new NewsServiceServer(this.client).getHeroImage(
            content.data.hero_image,
          );
          (notification.content as News).heroImage = heroImage;
        }

        if ('tags' in content.data && content.data.tags?.length) {
          (notification.content as News).tags = await new TagsServiceServer(this.client).getTags(
            content.data.tags,
          );
        }
      }

      const notificationDisplay = NotificationDisplay.fromNotification(notification);
      return notificationDisplay;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
