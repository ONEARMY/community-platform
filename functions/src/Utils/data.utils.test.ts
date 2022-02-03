import {
  compareObjectDiffs,
  splitArrayToChunks,
  valuesAreDeepEqual,
} from './data.utils'

test('splitArrayToChunks', () => {
  const arrayLength = 20
  const chunksize = 3
  const arr = new Array(arrayLength).fill(0)
  expect(splitArrayToChunks(arr, chunksize)).toHaveLength(
    Math.ceil(arrayLength / chunksize),
  )
})

test('compareObjectDiffs', () => {
  const before = {
    stringSame: 'hello',
    stringDiff: 'hello',
    numberSame: 0,
    numberDiff: 0,
    mixedFalsySame: 0,
    mixedFalsyDiff: null,
    jsonSame: { stringSame: 'hello', jsonSame: { stringSame: 'hello' } },
    jsonDiff: { stringSame: 'hello', jsonSame: { stringDiff: 'goodbye' } },
    arraySame: [1, 'a', { stringSame: 'hello' }, null],
    arrayDiff: [1, 'a', { stringSame: 'hello' }, null],
    additionalBeforeDiff: 'additional field',
  }
  const after = {
    stringSame: 'hello',
    stringDiff: 'goodbye',
    numberSame: 0,
    numberDiff: 1,
    mixedFalsySame: 0,
    mixedFalsyDiff: undefined,
    jsonSame: { stringSame: 'hello', jsonSame: { stringSame: 'hello' } },
    jsonDiff: { stringSame: 'hello', jsonSame: { stringDiff: 'goodbye' } },
    arraySame: [1, 'a', { stringSame: 'hello' }, null],
    arrayDiff: [2, 'a', { stringSame: 'hello' }, null],
    additionalAfterDiff: 'additional after',
  }
  // stringify output comparison as jest equal does not do deep diff
  // which is what is meant to be tested (!)
  expect(JSON.stringify(compareObjectDiffs(before, after))).toEqual(
    JSON.stringify({
      stringDiff: {
        before: 'hello',
        after: 'goodbye',
      },

      numberDiff: {
        before: 0,
        after: 1,
      },
      mixedFalsyDiff: {
        before: null,
      },
      arrayDiff: {
        before: [
          1,
          'a',
          {
            stringSame: 'hello',
          },
          null,
        ],
        after: [
          2,
          'a',
          {
            stringSame: 'hello',
          },
          null,
        ],
      },
      additionalBeforeDiff: {
        before: 'additional field',
        after: undefined,
      },
      additionalAfterDiff: {
        before: undefined,
        after: 'additional after',
      },
    }),
  )
})

test('valuesAreDeepEqual', () => {
  const a = { hello: { nested: ['string', 1, true, { key: 'value' }] } }
  const b = { hello: { nested: ['string', 1, true, { key: 'value' }] } }
  expect(valuesAreDeepEqual(a, b)).toBe(true)

  expect(valuesAreDeepEqual('', null)).toBe(false)
  expect(valuesAreDeepEqual([], undefined)).toBe(false)

  const c = { hello: { nested: ['string', 1, true, { key: 'value' }] } }
  const d = { hello: { nested: ['string', 1, true, { key: 'diff' }] } }
  expect(valuesAreDeepEqual(c, d)).toBe(false)
})
