import { filterNonDeletedComments } from './filterNonDeletedComments'

import type { IComment } from 'oa-shared'

export const nonDeletedCommentsCount = (comments: IComment[]): number => {
  return filterNonDeletedComments(comments).length
}
