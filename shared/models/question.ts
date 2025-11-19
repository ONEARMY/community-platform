import { Author } from './author';
import { Category } from './category';

import type { DBAuthor } from './author';
import type { DBCategory } from './category';
import type { IConvertedFileMeta } from './common';
import type { IContentDoc, IDBContentDoc } from './content';
import type { DBMedia, Image } from './media';
import type { SelectValue } from './other';
import type { Tag } from './tag';

export class DBQuestion implements IDBContentDoc {
  readonly id: number;
  is_draft: boolean;
  readonly created_at: Date;
  readonly modified_at: Date | null;
  readonly author?: DBAuthor;
  readonly comment_count?: number;
  readonly category: DBCategory | null;
  readonly category_id?: number;
  readonly created_by: number | null;
  readonly deleted: boolean | null;
  readonly subscriber_count?: number;
  readonly title: string;
  readonly total_views?: number;
  readonly previous_slugs: string[];
  readonly slug: string;
  readonly tags: number[];
  readonly useful_count?: number;

  readonly description: string;
  readonly images: DBMedia[] | null;

  constructor(question: DBQuestion) {
    Object.assign(this, question);
  }
}

export class Question implements IContentDoc {
  id: number;
  author: Author | null;
  category: Category | null;
  commentCount: number;
  createdAt: Date;
  deleted: boolean;
  isDraft: boolean;
  modifiedAt: Date | null;
  previousSlugs: string[];
  slug: string;
  subscriberCount: number;
  tags: Tag[];
  tagIds?: number[];
  title: string;
  totalViews: number;
  usefulCount: number;

  description: string;
  images: Image[] | null;

  constructor(question: Question) {
    Object.assign(this, question);
  }

  static fromDB(obj: DBQuestion, tags: Tag[], images?: Image[]) {
    return new Question({
      id: obj.id,
      author: obj.author ? Author.fromDB(obj.author) : null,
      category: obj.category ? Category.fromDB(obj.category) : null,
      createdAt: new Date(obj.created_at),
      commentCount: obj.comment_count || 0,
      deleted: obj.deleted || false,
      description: obj.description,
      images: images || [],
      isDraft: obj.is_draft || false,
      modifiedAt: obj.modified_at ? new Date(obj.modified_at) : null,
      previousSlugs: obj.previous_slugs,
      slug: obj.slug,
      subscriberCount: obj.subscriber_count || 0,
      tagIds: obj.tags,
      tags: tags,
      title: obj.title,
      totalViews: obj.total_views || 0,
      usefulCount: obj.useful_count || 0,
    });
  }
}

export type QuestionFormData = {
  category: SelectValue | null;
  description: string;
  existingImages: Image[] | null;
  images: IConvertedFileMeta[] | null;
  isDraft: boolean;
  tags?: number[];
  title: string;
};
