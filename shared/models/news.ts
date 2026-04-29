import { marked } from 'marked';
import { processStandaloneYouTubeUrls, processYouTubeLinks } from '../utils/markdown';
import type { DBAuthor } from './author';
import { Author } from './author';
import type { DBCategory } from './category';
import { Category } from './category';
import type { IContentDoc, IDBContentDoc } from './content';
import { DBEmailContentReach, EmailContentReach } from './emailContentReach';
import { DBMedia, Image, MediaWithPublicUrl } from './media';
import type { DBProfileBadge } from './profileBadge';
import { ProfileBadge } from './profileBadge';
import type { SelectValue } from './selectValue';
import type { Tag } from './tag';

export class DBNews implements IDBContentDoc {
  readonly id: number;
  readonly created_at: Date;
  readonly modified_at: Date | null;
  readonly published_at: Date | null;
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
  readonly profile_badges: { profile_badges: DBProfileBadge }[] | null;
  readonly slug: string;
  readonly summary: string | null;
  readonly tags: number[];
  readonly useful_count?: number;
  readonly body: string;
  readonly hero_image: DBMedia | null;
  readonly email_content_reach: DBEmailContentReach | null;

  static toFormData(news: DBNews, publicHeroImage: Image | null) {
    let htmlBody = marked(news.body, {
      breaks: true,
      gfm: true,
    }) as string;

    htmlBody = processYouTubeLinks(htmlBody);
    htmlBody = processStandaloneYouTubeUrls(htmlBody);

    const profileBadges = news.profile_badges?.map((pb) => pb.profile_badges.id.toString()) || null;

    return {
      body: news.body,
      category: news.category
        ? { value: news.category.id.toString(), label: news.category.name }
        : null,
      isDraft: news.is_draft || false,
      heroImage:
        news.hero_image && publicHeroImage ? { ...news.hero_image, ...publicHeroImage } : null,
      profileBadges,
      tags: news.tags,
      title: news.title,
      emailContentReach: DBEmailContentReach.toCreateCreateFormField(news.email_content_reach),
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
  profileBadges: ProfileBadge[] | null;
  previousSlugs: string[];
  publishedAt: Date | null;
  slug: string;
  subscriberCount: number;
  summary: string | null;
  tags: Tag[];
  tagIds?: number[];
  title: string;
  totalViews: number;
  usefulCount: number;
  emailContentReach: EmailContentReach | null;

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

    const profileBadges =
      news.profile_badges?.map((pb) => ProfileBadge.fromDB(pb.profile_badges)) || [];

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
      profileBadges,
      previousSlugs: news.previous_slugs,
      publishedAt: news.published_at ? new Date(news.published_at) : null,
      slug: news.slug,
      subscriberCount: news.subscriber_count || 0,
      summary: news.summary || null,
      tagIds: news.tags,
      tags,
      title: news.title,
      totalViews: news.total_views || 0,
      usefulCount: news.useful_count || 0,
      emailContentReach:
        news.email_content_reach && EmailContentReach.fromDB(news.email_content_reach || null),
    });
  }
}

export type NewsFormData = {
  body: string | null;
  category: SelectValue | null;
  heroImage: MediaWithPublicUrl | null;
  isDraft: boolean | null;
  profileBadges: (string | null)[] | null;
  tags?: number[];
  title: string;
  emailContentReach: SelectValue | null;
};

export type NewsDTO = {
  title: string;
  body: string | null;
  category: number | null;
  heroImage: DBMedia | null;
  isDraft: boolean | null;
  profileBadges: number[] | null;
  tags: number[] | null;
  emailContentReach: number | null;
};
