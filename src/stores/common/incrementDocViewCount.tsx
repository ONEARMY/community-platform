import type { IHowto, IQuestion, IResearch } from 'oa-shared'
import type { DatabaseV2 } from '../databaseV2/DatabaseV2'
import type { DBEndpoint } from '../databaseV2/endpoints'

type ICollection = Partial<IHowto | IQuestion.Item | IResearch.Item>

interface IProps {
  collection: DBEndpoint
  db: DatabaseV2
  doc: ICollection
}

export const incrementDocViewCount = async ({
  collection,
  db,
  doc,
}: IProps) => {
  const { _id, total_views } = doc
  const dbRef = db.collection<ICollection>(collection).doc(_id)

  const incrementedViews = (total_views || 0) + 1

  await dbRef.update(
    { total_views: incrementedViews },
    { keep_modified_timestamp: true },
  )
}
