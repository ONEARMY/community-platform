import * as functions from 'firebase-functions'
import { compareObjectDiffs } from '../Utils'
import { DB_ENDPOINTS, IUserDB } from '../models'
import {
  VALUE_MODIFIERS,
  handleDBAggregations,
  IAggregation,
} from './common.aggregations'

interface IUserAggregation extends IAggregation {
  sourceFields: (keyof IUserDB)[]
}

const userAggregations: IUserAggregation[] = [
  // aggregate all users with verified badges
  {
    sourceCollection: 'users',
    sourceFields: ['badges'],
    changeType: 'updated',
    targetCollection: 'aggregations',
    targetDocId: 'users_verified',
    process: ({ dbChange }) => {
      const user: IUserDB = dbChange.after.data() as any
      // return user doc id and verified status (removing entry if not verified)
      const value = user.badges?.verified ? true : VALUE_MODIFIERS.delete()
      return {
        [dbChange.after.id]: value,
      }
    },
  },
  // The voted useful aggregator is more complex, as it needs to record
  // changes in nested field and update overall counters instead of just values
  {
    sourceCollection: 'users',
    sourceFields: ['votedUsefulHowtos'],
    changeType: 'updated',
    targetCollection: 'aggregations',
    targetDocId: 'users_votedUsefulHowtos',
    process: ({ dbChange }) => {
      const { before, after } = dbChange
      const changedVotes = compareObjectDiffs(
        before.data().votedUsefulHowtos,
        after.data().votedUsefulHowtos,
      )
      const updates = {}
      for (const [howto_id, change] of Object.entries(changedVotes)) {
        let changeValue: number
        // during seed before values are all undefined, so use truthy/falsy checks instead of strict true/false
        if (change.after && !change.before) changeValue = 1
        if (change.before && !change.after) changeValue = -1
        if (changeValue) {
          updates[howto_id] = VALUE_MODIFIERS.increment(changeValue)
        }
      }
      // only return non-empty updates
      return Object.keys(updates).length > 0 ? updates : null
    },
  },
  // The aggregation is also duplicated for research votes
  // TODO - could likely combine into single function (if better way to set targetDocId dynamically)
  {
    sourceCollection: 'users',
    sourceFields: ['votedUsefulResearch'],
    changeType: 'updated',
    targetCollection: 'aggregations',
    targetDocId: 'users_votedUsefulResearch',
    process: ({ dbChange }) => {
      const { before, after } = dbChange
      const changedVotes = compareObjectDiffs(
        before.data().votedUsefulResearch,
        after.data().votedUsefulResearch,
      )
      const updates = {}
      for (const [howto_id, change] of Object.entries(changedVotes)) {
        let changeValue: number
        // during seed before values are all undefined, so use truthy/falsy checks instead of strict true/false
        if (change.after && !change.before) changeValue = 1
        if (change.before && !change.after) changeValue = -1
        if (changeValue) {
          updates[howto_id] = VALUE_MODIFIERS.increment(changeValue)
        }
      }
      // only return non-empty updates
      return Object.keys(updates).length > 0 ? updates : null
    },
  },
]

/** Watch changes to all user docs and apply aggregations */
exports.default = functions.firestore
  .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate((change) => {
    return handleDBAggregations(change, userAggregations)
  })
