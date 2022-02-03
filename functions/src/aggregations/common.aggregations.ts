import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { DB_ENDPOINTS } from '../models'
import { db } from '../Firebase/firestoreDB'
import { compareObjectDiffs } from '../Utils/data.utils'

type IDocumentRef = FirebaseFirestore.DocumentReference
type ICollectionRef = FirebaseFirestore.CollectionReference
type IDBChange = functions.Change<functions.firestore.QueryDocumentSnapshot>

export interface IAggregation {
  /** Collection field to watch for aggregations */
  field: string
  /** Aggregation field to apply updates to */
  aggregationField: string
  /** Value aggregators store all updated values, count simply total entries */
  //   aggregationType: 'value' | 'count'
  handleAggregationUpdate?: (handler: AggregationHandler) => Promise<any>
  handleAggregationSeed?: (handler: AggregationHandler) => Promise<any>
}

/**
 * Takes triggered database change and determines which (if any) aggregations
 * to update, and runs via an aggregation update handler
 */
export async function handleDBAggregations(
  dbChange: functions.Change<functions.firestore.QueryDocumentSnapshot>,
  aggregations: IAggregation[],
) {
  const { before, after } = dbChange
  const changedFields = compareObjectDiffs(before.data(), after.data())
  if (Object.keys(changedFields).length === 0) {
    // changed detected by firestore but not locally
    console.warn('change missed', before.data(), after.data())
  }
  for (const fieldname of Object.keys(changedFields)) {
    for (const aggregation of aggregations) {
      if (aggregation.field === fieldname) {
        const update = changedFields[fieldname]
        await new AggregationHandler(aggregation, dbChange, update).run()
      }
    }
  }
}

export class AggregationHandler {
  /** Reference to database path for aggregation doc */
  public aggregationRef: IDocumentRef
  /** Reference to database path for triggered collection */
  public collectionRef: ICollectionRef

  constructor(
    public aggregation: IAggregation,
    public dbChange: IDBChange,
    public valueChange: { before: any; after: any },
  ) {
    this.collectionRef = dbChange.after.ref.parent
    // apply function overrides
    if (aggregation.handleAggregationSeed) {
      this.seed = () => aggregation.handleAggregationSeed(this)
    }
    if (aggregation.handleAggregationUpdate) {
      this.update = () => aggregation.handleAggregationUpdate(this)
    }
  }

  /**
   * Check if target aggregation exists. If not, seed initial data.
   * If yes, update with updated values
   */
  public async run() {
    const { aggregationField } = this.aggregation
    this.aggregationRef = db
      .collection(DB_ENDPOINTS.aggregations)
      .doc(aggregationField)
    const aggregationDoc = await this.aggregationRef.get()
    return aggregationDoc.exists ? this.update() : this.seed()
  }

  /**
   * Update aggregation field in response to local changes. Deletes aggregation
   * entry in case where updated field no longer valid for aggregation
   */
  private async update() {
    const value = this.valueChange.after
    const valid = isValidAggregationEntry(value)
    const doc_id = this.dbChange.after.id
    return this.aggregationRef.update({
      [doc_id]: valid ? value : admin.firestore.FieldValue.delete(),
    })
  }

  /**
   * Query all documents under aggregation watch, retrieve those with entry for
   * watched field and batch update all aggregation entries
   */
  private async seed() {
    const { field } = this.aggregation
    // orderBy will only filter to include docs with field populated
    const snapshot = await this.collectionRef.orderBy(field).get()
    const seedData = {}
    for (const doc of snapshot.docs) {
      const aggregationEntry = doc.data()[field]
      if (isValidAggregationEntry(aggregationEntry))
        seedData[doc.id] = aggregationEntry
    }
    return this.aggregationRef.set(seedData)
  }
}

/** Avoid storing empty arrays, objects or other falsy values in aggregation */
function isValidAggregationEntry(v: any) {
  if (!v) return false
  if (typeof v === 'object') return Object.keys(v).length > 0
  if (Array.isArray(v)) return v.length > 0
  return true
}
