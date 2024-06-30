import { filterNonDeletedComments } from './filterNonDeletedComments'

import type { IComment } from '../models'

export const nonDeletedCommentsCount = (comments: IComment[]): number => {
  return filterNonDeletedComments(comments).length
}
