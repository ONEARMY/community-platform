import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { compareObjectDiffs } from '../Utils/data.utils'
import { DB_ENDPOINTS, IUserDB } from '../models'
import { handleDBAggregations, IAggregation } from './common.aggregations'

interface IUserAggregation extends IAggregation {
  field: keyof IUserDB
}

const userAggregations: IUserAggregation[] = [
  // aggregate all users with lists of badges
  {
    field: 'badges',
    aggregationField: 'user_badges',
  },
  // The voted useful aggregator is more complex, as it needs to record
  // changes in nested field and update overall counters instead of just values
  {
    field: 'votedUsefulHowtos',
    aggregationField: 'user_votedUsefulHowtos',
    handleAggregationSeed: async aggregator => {
      const snapshot = await aggregator.collectionRef
        .orderBy('votedUsefulHowtos')
        .get()
      const allVotes = snapshot.docs
        .map(d => d.data() as IUserDB)
        .map(u => u.votedUsefulHowtos)
      const votesByHowto = countHowtoVotes(allVotes)
      return aggregator.aggregationRef.set(votesByHowto)
    },
    handleAggregationUpdate: async aggregator => {
      const { before, after } = aggregator.valueChange
      const changedVotes = compareObjectDiffs(before, after)
      for (const [howto_id, change] of Object.entries(changedVotes)) {
        const counterChange = change.after === true ? 1 : -1
        await aggregator.aggregationRef.update({
          [howto_id]: admin.firestore.FieldValue.increment(counterChange),
        })
      }
    },
  },
]

/** Watch changes to all user docs and apply aggregations */
exports.default = functions.firestore
  .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate(change => {
    return handleDBAggregations(change, userAggregations)
  })

/**
 * Howto votes are stored in key:value pairs corresponding to howto id and
 * vote true/false. Collate all votes across all users by howto for intial seed stats
 */
function countHowtoVotes(allVotes: IUserDB['votedUsefulHowtos'][]) {
  const votesByHowto = {}
  for (const votes of allVotes) {
    Object.entries(votes).forEach(([howto_id, voted]) => {
      if (voted) {
        if (!votesByHowto.hasOwnProperty(howto_id)) {
          votesByHowto[howto_id] = 0
        }
        votesByHowto[howto_id]++
      }
    })
  }
  return votesByHowto
}
