import { SupabaseClient } from '@supabase/supabase-js';
import { DBMedia, DBNotification, News, Notification, NotificationDisplay } from 'oa-shared';
import { NewsServiceServer } from './newsService.server';

export class NotificationMapperServiceServer {
  constructor(private client: SupabaseClient) {}

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
        notification.content = content.data;
      } else {
        throw Error('Content not found, probably deleted');
      }

      if (notification.content && content.data?.hero_image) {
        const heroImage = await new NewsServiceServer(this.client).getHeroImage(
          content.data.hero_image as DBMedia,
        );
        (notification.content as News).heroImage = heroImage;
      }

      const notificationDisplay = NotificationDisplay.fromNotification(notification);
      return notificationDisplay;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
