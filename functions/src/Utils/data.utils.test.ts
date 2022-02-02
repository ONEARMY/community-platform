import { objectsAreEqualShallow, splitArrayToChunks } from './data.utils'

test('splitArrayToChunks', () => {
  const arrayLength = 20
  const chunksize = 3
  const arr = new Array(arrayLength).fill(0)
  expect(splitArrayToChunks(arr, chunksize)).toHaveLength(
    Math.ceil(arrayLength / chunksize),
  )
})

test('objectsAreEqualShallow', () => {
  /** True cases **/
  expect(objectsAreEqualShallow({}, {})).toBe(true)
  expect(
    objectsAreEqualShallow({ a: true, b: false }, { a: true, b: false }),
  ).toBe(true)
  expect(
    objectsAreEqualShallow({ a: true, b: false }, { b: false, a: true }),
  ).toBe(true)

  /** False cases **/
  expect(
    objectsAreEqualShallow({ a: true, b: false }, { a: true, b: true }),
  ).toBe(false)
  expect(objectsAreEqualShallow(undefined, { a: true, b: true })).toBe(false)

  /** Edge cases **/
  // missing data assumed same as empty object
  expect(objectsAreEqualShallow(undefined, {})).toBe(true)
  //  deeply nested will always return false
  expect(objectsAreEqualShallow({ a: { b: true } }, { a: { b: true } })).toBe(
    false,
  )
  expect(
    objectsAreEqualShallow(
      { a: { b: { c: true } } },
      { a: { b: { c: true } } },
    ),
  ).toBe(false)
})
