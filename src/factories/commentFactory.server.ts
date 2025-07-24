import { Author, Comment } from 'oa-shared'

import type { DBAuthor, DBComment, Reply } from 'oa-shared'
import type { ImageServiceServer } from 'src/services/imageService.server'

export class CommentFactory {
  constructor(private imageService: ImageServiceServer) {}

  async fromDBWithAuthor(
    dbComment: DBComment,
    replies?: Reply[],
  ): Promise<Comment> {
    const author = dbComment.profile
      ? await this.createAuthor(dbComment.profile)
      : null

    return new Comment({
      id: dbComment.id,
      createdAt: new Date(dbComment.created_at),
      createdBy: author,
      modifiedAt: dbComment.modified_at
        ? new Date(dbComment.modified_at)
        : null,
      comment: dbComment.comment,
      sourceId: dbComment.source_id || dbComment.source_id_legacy || 0,
      sourceType: dbComment.source_type,
      parentId: dbComment.parent_id,
      deleted: dbComment.deleted,
      replies: replies,
    })
  }

  private async createAuthor(dbAuthor: DBAuthor): Promise<Author> {
    const photo = dbAuthor.photo
      ? this.imageService.getPublicUrl(dbAuthor.photo)
      : undefined

    return Author.fromDB(dbAuthor, photo)
  }
}
