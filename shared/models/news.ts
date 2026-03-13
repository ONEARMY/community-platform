import { marked } from 'marked';
import { processStandaloneYouTubeUrls, processYouTubeLinks } from '../utils/markdown';
import type { DBAuthor } from './author';
import { Author } from './author';
import type { DBCategory } from './category';
import { Category } from './category';
import type { IContentDoc, IDBContentDoc } from './content';
import { DBMedia, Image, MediaWithPublicUrl } from './media';
import type { DBProfileBadge } from './profileBadge';
import { ProfileBadge } from './profileBadge';
import type { SelectValue } from './selectValue';
import type { Tag } from './tag';

export class DBNews implements IDBContentDoc {
  readonly id: number;
  readonly created_at: Date;
  readonly modified_at: Date | null;
  readonly author?: DBAuthor;
  readonly comment_count?: number;
  readonly category: DBCategory | null;
  readonly category_id?: number;
  readonly created_by: number | null;
  readonly deleted: boolean | null;
  is_draft: boolean | null;
  readonly subscriber_count?: number;
  readonly title: string;
  readonly total_views?: number;
  readonly previous_slugs: string[];
  readonly profile_badge: DBProfileBadge | null;
  readonly slug: string;
  readonly summary: string | null;
  readonly tags: number[];
  readonly useful_count?: number;
  readonly body: string;
  readonly hero_image: DBMedia | null;

  static toFormData(news: DBNews, publicHeroImage: Image | null) {
    let htmlBody = marked(news.body, {
      breaks: true,
      gfm: true,
    }) as string;

    htmlBody = processYouTubeLinks(htmlBody);
    htmlBody = processStandaloneYouTubeUrls(htmlBody);

    return {
      body: news.body,
      category: news.category
        ? { value: news.category.id.toString(), label: news.category.name }
        : null,
      isDraft: news.is_draft || false,
      heroImage:
        news.hero_image && publicHeroImage ? { ...news.hero_image, ...publicHeroImage } : null,
      profileBadge: news.profile_badge
        ? { value: news.profile_badge.id.toString(), label: news.profile_badge.name }
        : null,
      tags: news.tags,
      title: news.title,
    } satisfies NewsFormData;
  }
}

export type EditNews = Omit<News, 'heroImage'> & {
  heroImage: DBMedia | null;
};

export class News implements IContentDoc {
  id: number;
  author: Author | null;
  body: string;
  bodyHtml: string;
  category: Category | null;
  commentCount: number;
  createdAt: Date;
  deleted: boolean;
  heroImage: Image | null;
  isDraft: boolean;
  modifiedAt: Date | null;
  profileBadge: ProfileBadge | null;
  previousSlugs: string[];
  slug: string;
  subscriberCount: number;
  summary: string | null;
  tags: Tag[];
  tagIds?: number[];
  title: string;
  totalViews: number;
  usefulCount: number;

  constructor(news: Partial<News>) {
    Object.assign(this, news);
  }

  static fromDB(news: DBNews, tags: Tag[], heroImage?: Image | null) {
    let htmlBody = marked(news.body, {
      breaks: true,
      gfm: true,
    }) as string;

    htmlBody = processYouTubeLinks(htmlBody);
    htmlBody = processStandaloneYouTubeUrls(htmlBody);

    return new News({
      id: news.id,
      author: news.author ? Author.fromDB(news.author) : null,
      body: news.body,
      bodyHtml: htmlBody,
      category: news.category ? Category.fromDB(news.category) : null,
      commentCount: news.comment_count || 0,
      createdAt: new Date(news.created_at),
      deleted: news.deleted || false,
      isDraft: news.is_draft || false,
      heroImage: heroImage || null,
      modifiedAt: news.modified_at ? new Date(news.modified_at) : null,
      profileBadge: news.profile_badge ? ProfileBadge.fromDB(news.profile_badge) : null,
      previousSlugs: news.previous_slugs,
      slug: news.slug,
      subscriberCount: news.subscriber_count || 0,
      summary: news.summary || null,
      tagIds: news.tags,
      tags,
      title: news.title,
      totalViews: news.total_views || 0,
      usefulCount: news.useful_count || 0,
    });
  }
}

export type NewsFormData = {
  body: string | null;
  category: SelectValue | null;
  heroImage: MediaWithPublicUrl | null;
  isDraft: boolean | null;
  profileBadge: SelectValue | null;
  tags?: number[];
  title: string;
};
