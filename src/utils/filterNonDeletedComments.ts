import type { IComment } from 'oa-shared'

export const filterNonDeletedComments = (comments: IComment[]): IComment[] => {
  return comments.filter(({ _deleted }) => _deleted !== true)
}
