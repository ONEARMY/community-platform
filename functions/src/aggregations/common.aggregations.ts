import { firestore } from 'firebase-admin'
import { Change, logger } from 'firebase-functions'
import { DB_ENDPOINTS, IDBEndpoint } from '../models'
import { db } from '../Firebase/firestoreDB'
import { compareObjectDiffs, splitArrayToChunks } from '../Utils/data.utils'
import { FieldValue } from 'firebase-admin/firestore'

type IDocumentRef = FirebaseFirestore.DocumentReference
type ICollectionRef = FirebaseFirestore.CollectionReference
type IDBChange = Change<firestore.QueryDocumentSnapshot>

export const VALUE_MODIFIERS = {
  delete: () => FieldValue.delete(),
  increment: (value: number) => FieldValue.increment(value),
}

export interface IAggregation {
  /**
   * Changetype supported (currently only updated)
   * Full list: https://firebase.google.com/docs/functions/firestore-events
   * */
  changeType: 'updated'
  /** DB collection watched for changes */
  sourceCollection: IDBEndpoint
  /**
   * Collection fields to trigger aggregation on update.
   * The first named field will be assumed required and used during initial seed query
   **/
  sourceFields: string[]
  /** function used to generate aggregation value from source data */
  process: (aggregation: AggregationHandler) => Record<string, any> | string[]
  /** Collection ID for output aggregated data */
  targetCollection: IDBEndpoint
  /** Document ID for aggregated data in target aggregation collection */
  targetDocId: string
}

/**
 * Takes triggered database change and determines which (if any) aggregations
 * to update, and runs via an aggregation update handler
 */
export async function handleDBAggregations(
  dbChange: Change<firestore.QueryDocumentSnapshot>,
  aggregations: IAggregation[],
) {
  const { before, after } = dbChange
  const changedFields = compareObjectDiffs(before.data(), after.data())
  if (Object.keys(changedFields).length === 0) {
    // changed detected by firestore but not locally
    logger.warn('change missed', before.data(), after.data())
  }
  const changedFieldnames = Object.keys(changedFields)
  for (const aggregation of aggregations) {
    // run aggregation if any specified aggregation field matches any changed field
    const shouldRunAggregation = aggregation.sourceFields.some((fieldname) =>
      changedFieldnames.includes(fieldname),
    )
    if (shouldRunAggregation) {
      await new AggregationHandler(aggregation, dbChange).run()
    }
  }
}

export class AggregationHandler {
  /** Reference to database path for target aggregation doc */
  public targetDocRef: IDocumentRef
  /** Reference to database path for source triggered collection */
  public sourceCollectionRef: ICollectionRef
  /** Before and after values for use in aggregation process method */
  public dbChange: IDBChange
  /** Reference to aggregation definition triggered as part of process */
  public aggregation: IAggregation

  public updates: Record<string, any>

  constructor(aggregation: IAggregation, dbChange: IDBChange) {
    this.aggregation = aggregation
    this.dbChange = dbChange

    // use the triggered db change to determine what the source collection is
    // use the aggregation to specify the target collection and document id
    this.sourceCollectionRef = dbChange.after.ref.parent
    const { targetCollection, targetDocId } = aggregation
    this.targetDocRef = db
      .collection(DB_ENDPOINTS[targetCollection] || targetCollection)
      .doc(targetDocId)
  }

  /**
   * Check if target aggregation exists. If not, seed initial data.
   * If yes, update with updated values
   */
  public async run() {
    const targetDoc = await this.targetDocRef.get()
    return targetDoc.exists ? this.update() : this.seed()
  }

  public async get() {
    const snapshot = await this.targetDocRef.get()
    return snapshot.data()
  }

  /**
   * Update aggregation field in response to local changes. Deletes aggregation
   * entry in case where updated field no longer valid for aggregation
   */
  private async update() {
    const aggregationValues = await this.calculateAggregation()
    return aggregationValues
      ? this.targetDocRef.update(aggregationValues)
      : null
  }

  /**
   * Query all documents under aggregation watch, retrieve those with entry for
   * watched field and batch update all aggregation entries
   */
  private async seed() {
    logger.info(`[Aggregation Seed] ${this.sourceCollectionRef.id}`)
    const updateEntries: { ref: IDocumentRef; entry: any }[] = []

    // Seed total useful aggregation
    if (this.aggregation.targetDocId === 'users_totalUseful') {
      const users = await db.collection(DB_ENDPOINTS['users']).get()

      const userIds = []
      users.forEach((user) => userIds.push(user.id))
      for (let i = 0; i < userIds.length; i++) {
        const count = await this.calculateTotalUseful(userIds[i])
        if (count[userIds[i]] > 0) {
          updateEntries.push({
            ref: this.targetDocRef,
            entry: count,
          })
        }
      }
    }
    // Seed other aggregation types
    else {
      //orderBy will only filter to include docs with primary field populated
      const { sourceFields } = this.aggregation
      const snapshot = await this.sourceCollectionRef
        .orderBy(sourceFields[0])
        .get()
      for (const doc of snapshot.docs) {
        // for purpose of seeding before will always be empty so just track each doc in after state
        this.dbChange.before.data = () => ({})
        this.dbChange.after = doc
        const aggregationEntry = this.aggregation.process(this)
        if (aggregationEntry) {
          updateEntries.push({
            ref: this.targetDocRef,
            entry: aggregationEntry,
          })
        }
      }
    }

    // firebase supports up to 500 requests every second
    // as each update uses 2 ops (set + update) run in batches of 250

    const chunks = splitArrayToChunks(updateEntries, 250)
    for (const [index, chunk] of chunks.entries()) {
      const batch = db.batch()
      if (index === 0) {
        batch.set(this.targetDocRef, {})
      }
      chunk.forEach(({ ref, entry }) => batch.update(ref, entry))
      await batch.commit()
      await _sleep(1000)
    }
  }

  private async calculateAggregation() {
    // If key/value pairs then set update object values immediately
    const processValues = this.aggregation.process(this)
    if (!Array.isArray(processValues)) {
      this.updates = processValues
      return
    }

    // If an array but length = 0 then return
    if (processValues.length === 0) return

    // We have an array so continue with calculations
    let calculations = {}
    for (let i = 0; i < processValues.length; i++) {
      const id = processValues[i]
      if (this.aggregation.targetDocId === 'users_totalUseful') {
        const update = await this.calculateTotalUseful(id)
        calculations = { ...calculations, ...update }
      }
    }
    return calculations
  }

  private async calculateTotalUseful(id: string) {
    const userTotalUseful = {}

    const howtos = await db
      .collection(DB_ENDPOINTS['howtos'])
      .where('_createdBy', '==', id)
      .where('votedUsefulBy', '!=', [])
      .get()

    let totalUseful = 0

    if (!howtos.empty) {
      for (let i = 0; i < howtos.docs.length; i++) {
        const data = howtos.docs[i].data()
        totalUseful += data.votedUsefulBy.length
      }
    }

    const userResearch = {}

    // get research useful if created by user
    const createdResearch = await db
      .collection(DB_ENDPOINTS['research'])
      .where('_createdBy', '==', id)
      .where('votedUsefulBy', '!=', [])
      .get()

    if (!createdResearch.empty) {
      for (let i = 0; i < createdResearch.docs.length; i++) {
        const data = createdResearch.docs[i].data()
        userResearch[data._id] = data.votedUsefulBy.length
      }
    }

    // get research useful if user is a collaborator
    const collaboratedResearch = await db
      .collection(DB_ENDPOINTS['research'])
      .where('collaborators', 'array-contains', id)
      .where('votedUsefulBy', '!=', [])
      .get()

    if (!collaboratedResearch.empty) {
      for (let i = 0; i < collaboratedResearch.docs.length; i++) {
        const data = collaboratedResearch.docs[i].data()
        userResearch[data._id] = data.votedUsefulBy.length
      }
    }

    const useful: number[] = Object.values(userResearch)
    totalUseful += useful.length > 0 ? useful.reduce((a, b) => a + b) : 0
    userTotalUseful[id] = totalUseful
    return userTotalUseful
  }
}

/** Avoid storing empty arrays, objects or other falsy values in aggregation */
export function isValidAggregationEntry(v: any) {
  if (!v) return false
  if (typeof v === 'object') return Object.keys(v).length > 0
  if (Array.isArray(v)) return v.length > 0
  return true
}

function _sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
