import { SupabaseClient } from '@supabase/supabase-js';
import {
  type Database,
  DBNotification,
  News,
  Notification,
  type NotificationContentType,
  NotificationDisplay,
  type Tables,
} from 'oa-shared';
import { logger } from 'src/logger';
import { NewsServiceServer } from './newsService.server';
import { TagsServiceServer } from './tagsService.server';

type ContentRow = Tables<NotificationContentType>;

const contentKey = (type: string, id: number) => `${type}:${id}`;

export class NotificationMapperServiceServer {
  constructor(private client: SupabaseClient<Database>) {}

  async transformNotification(dbNotification: DBNotification) {
    const [notificationDisplay] = await this.transformNotifications([dbNotification], true);

    if (!notificationDisplay) {
      throw Error('Notification could not be transformed');
    }

    return notificationDisplay;
  }

  async transformNotifications(dbNotifications: DBNotification[], withTags = false) {
    const contents = await this.getContents(dbNotifications);
    const tags = withTags ? await this.getTags(Array.from(contents.values())) : [];
    const newsService = new NewsServiceServer(this.client);

    const results = await Promise.all(
      dbNotifications.map(async (dbNotification) => {
        try {
          const content = contents.get(
            contentKey(dbNotification.content_type, dbNotification.content_id),
          );

          if (!content) {
            throw Error('Content not found, probably deleted');
          }

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

          notification.content = { ...content } as unknown as Notification['content'];

          if ('hero_image' in content && content.hero_image) {
            (notification.content as News).heroImage = await newsService.getHeroImage(
              content.hero_image,
            );
          }

          if ('tags' in content) {
            const contentTags = content.tags ?? [];
            (notification.content as News).tags = tags.filter((tag) =>
              contentTags.includes(tag.id),
            );
          }

          return NotificationDisplay.fromNotification(notification);
        } catch (error) {
          logger.error(error);
          return null;
        }
      }),
    );

    return results.filter((result) => result !== null);
  }

  private getTags(contents: ContentRow[]) {
    const tagIds = new Set(
      contents.flatMap((content) => ('tags' in content && content.tags) || []),
    );
    return new TagsServiceServer(this.client).getTags(Array.from(tagIds));
  }

  private async getContents(dbNotifications: DBNotification[]) {
    const idsByType = Map.groupBy(dbNotifications, (n) => n.content_type);

    const results = await Promise.all(
      Array.from(idsByType, async ([type, notifications]) => {
        const { data, error } = await this.client
          .from(type)
          .select('*')
          .in(
            'id',
            notifications.map((n) => n.content_id),
          );

        if (error) {
          logger.error(error);
        }

        return ((data ?? []) as ContentRow[]).map(
          (row) => [contentKey(type, row.id), row] as const,
        );
      }),
    );

    return new Map(results.flat());
  }
}
