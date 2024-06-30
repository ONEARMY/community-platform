import type { IComment } from 'src/models'

export const filterNonDeletedComments = (comments: IComment[]): IComment[] => {
  return comments.filter(({ _deleted }) => _deleted !== true)
}
