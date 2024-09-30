import type {
  IComment,
  IDiscussion,
  IDiscussionSourceModelOptions,
} from 'oa-shared'

export const getDiscussionContributorsToNotify = (
  discussion: IDiscussion,
  parentContent: IDiscussionSourceModelOptions,
  comment: IComment,
  bonusIds?: string[] | undefined,
) => {
  const allRecipients = [
    parentContent._createdBy,
    ...(discussion.contributorIds || []),
    ...(bonusIds || []),
  ]
  const removeNewCommentCreator =
    allRecipients?.filter((id) => id !== comment._creatorId) || []
  const uniqueIds = [...new Set(removeNewCommentCreator)]

  return uniqueIds
}
