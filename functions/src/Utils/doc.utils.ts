export const createDoc = (data: object) => {
  return {
    ...data,
    _created: new Date().toISOString(),
    _modified: new Date().toISOString(),
    _deleted: false,
    _id: _generateDocID(),
  }
}

const _generateDocID = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let autoId = ''
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return autoId
}
