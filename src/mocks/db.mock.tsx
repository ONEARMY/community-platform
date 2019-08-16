import { IDbDoc } from 'src/models/common.models'

// helper methods used in generation of mock db data
export const MOCK_DB_META = (id?: string) => {
  const d1 = randomDate(new Date(2012, 0, 1), new Date())
  const d2 = randomDate(d1, new Date())
  const meta: IDbDoc = {
    _created: d1.toISOString(),
    _modified: d2.toISOString(),
    _createdBy: 'MockUser',
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

// function used to generate random ID in same manner as firestore
function randomID() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let autoId = ''
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return autoId
}
