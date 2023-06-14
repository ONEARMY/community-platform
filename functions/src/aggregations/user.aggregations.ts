import * as functions from 'firebase-functions'
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
]

/** Watch changes to all user docs and apply aggregations */
exports.default = functions.firestore
  .document(`${DB_ENDPOINTS.users}/{id}`)
  .onUpdate((change) => {
    return handleDBAggregations(change, userAggregations)
  })
