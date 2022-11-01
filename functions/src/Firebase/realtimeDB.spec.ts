import rtdb from './realtimeDB'

// Check CRUD methods function on realtimeDB
describe('realtime db', () => {
  const testDocPath = '_test_'
  it('set', async () => {
    const res = await rtdb.set(testDocPath, { value: 'hello' })
    expect(res).toEqual(undefined)
  })
  it('get', async () => {
    const res = await rtdb.get(testDocPath)
    expect(res).toEqual({ value: 'hello' })
  })
  it('update', async () => {
    await rtdb.update(testDocPath, { value: 'updated' })
    const res = await rtdb.get(testDocPath)
    expect(res).toEqual({ value: 'updated' })
  })
  it('delete', async () => {
    await rtdb.delete(testDocPath)
    const res = await rtdb.get(testDocPath)
    expect(res).toEqual({})
  })
})
