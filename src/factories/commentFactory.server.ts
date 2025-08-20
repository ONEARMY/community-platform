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
      voteCount: dbComment.voteCount || 0,
      hasVoted: dbComment.hasVoted || false,
      replies: replies,
    })
  }

  async fromDBCommentsToThreads(dbComments: DBComment[]): Promise<Comment[]> {
    const commentsByParentId = this.groupCommentsByParentId(dbComments)

    const mainComments = commentsByParentId[0] ?? []

    const commentsWithReplies = await Promise.all(
      mainComments.map(async (mainComment: DBComment) => {
        const replyDBComments = commentsByParentId[mainComment.id] ?? []

        const replies: Reply[] = await Promise.all(
          replyDBComments.map((reply: DBComment) =>
            this.fromDBWithAuthor(reply, []),
          ),
        )

        const filteredReplies = replies
          .filter((reply) => !reply.deleted)
          .sort((a, b) => a.id - b.id)

        return this.fromDBWithAuthor(mainComment, filteredReplies)
      }),
    )

    return commentsWithReplies.filter(
      (comment: Comment) =>
        !comment.deleted || (comment.replies?.length || 0) > 0,
    )
  }

  private groupCommentsByParentId(
    dbComments: DBComment[],
  ): Record<number, DBComment[]> {
    return dbComments.reduce<Record<number, DBComment[]>>((acc, comment) => {
      const parentId = comment.parent_id ?? 0
      if (!acc[parentId]) {
        acc[parentId] = []
      }
      acc[parentId].push(comment)
      return acc
    }, {})
  }

  private async createAuthor(dbAuthor: DBAuthor): Promise<Author> {
    const photo = dbAuthor.photo
      ? this.imageService.getPublicUrl(dbAuthor.photo)
      : undefined

    return Author.fromDB(dbAuthor, photo)
  }
}
