import { toJS } from 'mobx'
import type { IHowto } from 'src/models'
import type { DatabaseV2 } from '../databaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

export const incrementDocViewCount = async (
  db: DatabaseV2,
  collectionName: DBEndpoint,
  docId,
) => {
  const dbRef = db.collection<IHowto>(collectionName).doc(docId)
  const docData = await toJS(dbRef.get('server'))
  const newTotalViews = (docData!.total_views || 0) + 1

  if (docData) {
    const updatedDoc = {
      ...docData,
      total_views: newTotalViews,
    }

    await dbRef.set(
      {
        ...updatedDoc,
      },
      { keep_modified_timestamp: true },
    )

    return updatedDoc.total_views
  }
}
