import { DBDoc } from 'src/models/common.models'
import { randomID } from 'src/utils/helpers'

// helper methods used in generation of mock db data
export const MOCK_DB_META = (id?: string) => {
  const d1 = randomDate(new Date(2012, 0, 1), new Date())
  const d2 = randomDate(d1, new Date())
  const meta: DBDoc = {
    _created: d1.toISOString(),
    _modified: d2.toISOString(),
    _deleted: false,
    _id: id ? id : randomID(),
  }
  return meta
}

// generate a random date between start and end
function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  )
}
