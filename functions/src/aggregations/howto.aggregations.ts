import * as functions from 'firebase-functions'
import { compareObjectDiffs } from '../Utils'
import { DB_ENDPOINTS, IHowtoDB } from '../models'
import { handleDBAggregations, IAggregation } from './common.aggregations'

interface IHowToAggregation extends IAggregation {
  sourceFields: (keyof IHowtoDB)[]
}

const howtoAggregations: IHowToAggregation[] = [
  {
    sourceCollection: 'howtos',
    sourceFields: ['votedUsefulBy', 'moderation'],
    changeType: 'updated',
    targetCollection: 'aggregations',
    targetDocId: 'users_totalUseful',
    process: ({ dbChange }) => {
      const { before, after } = dbChange
      const changedVotes = compareObjectDiffs(
        before.data().votedUsefulBy,
        after.data().votedUsefulBy,
      )

      if (Object.entries(changedVotes))
        return [dbChange.after.data()._createdBy]
    },
  },
]

/** Watch changes to all howto docs and apply aggregations */
exports.default = functions.firestore
  .document(`${DB_ENDPOINTS.howtos}/{id}`)
  .onUpdate((change) => {
    return handleDBAggregations(change, howtoAggregations)
  })
