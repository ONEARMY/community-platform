import * as functions from 'firebase-functions'
import { compareObjectDiffs } from '../Utils'
import { DB_ENDPOINTS, IResearchDB } from '../models'
import { handleDBAggregations, IAggregation } from './common.aggregations'

interface IResearchAggregation extends IAggregation {
  sourceFields: (keyof IResearchDB)[]
}

const researchAggregations: IResearchAggregation[] = [
  {
    sourceCollection: 'research',
    sourceFields: ['collaborators', 'moderation'],
    changeType: 'updated',
    targetCollection: 'aggregations',
    targetDocId: 'users_totalUseful',
    process: ({ dbChange }) => {
      const { before, after } = dbChange
      const changedVotes = compareObjectDiffs(
        before.data().votedUsefulBy,
        after.data().votedUsefulBy,
      )

      const userIds: string[] = []
      if (before.data().collaborators)
        userIds.push(...before.data().collaborators)
      if (after.data().collaborators)
        userIds.push(...after.data().collaborators)

      if (Object.entries(changedVotes))
        userIds.push(dbChange.after.data()._createdBy)

      return [...new Set([...userIds])]
    },
  },
]

/** Watch changes to all research docs and apply aggregations */
exports.default = functions.firestore
  .document(`${DB_ENDPOINTS.research}/{id}`)
  .onUpdate((change) => {
    return handleDBAggregations(change, researchAggregations)
  })
