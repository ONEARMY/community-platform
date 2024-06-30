import { filterNonDeletedComments } from './filterNonDeletedComments'

import type { IComment } from 'src/models'

export const nonDeletedCommentsCount = (comments: IComment[]): number => {
  return filterNonDeletedComments(comments).length
}
