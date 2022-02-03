import { compareObjectDiffs, splitArrayToChunks } from './data.utils'

test('splitArrayToChunks', () => {
  const arrayLength = 20
  const chunksize = 3
  const arr = new Array(arrayLength).fill(0)
  expect(splitArrayToChunks(arr, chunksize)).toHaveLength(
    Math.ceil(arrayLength / chunksize),
  )
})

test('objectsDiff', () => {
  const before = {
    stringSame: 'hello',
    stringDiff: 'hello',
    additionalBeforeDiff: 'additional field',
    numberSame: 0,
    numberDiff: 0,
    mixedFalsySame: 0,
    mixedFalsyDiff: null,
    jsonSame: { stringSame: 'hello', jsonSame: { stringSame: 'hello' } },
    jsonDiff: { stringSame: 'hello', jsonSame: { stringDiff: 'goodbye' } },
    arraySame: [1, 'a', { stringSame: 'hello' }, null],
    arrayDiff: [1, 'a', { stringSame: 'hello' }, null],
  }
  const after = {
    stringSame: 'hello',
    stringDiff: 'goodbye',
    additionalAfterDiff: 'additional after',
    numberSame: 0,
    numberDiff: 1,
    mixedFalsySame: 0,
    mixedFalsyDiff: undefined,
    jsonSame: { stringSame: 'hello', jsonSame: { stringSame: 'hello' } },
    jsonDiff: { stringSame: 'hello', jsonSame: { stringDiff: 'goodbye' } },
    arraySame: [1, 'a', { stringSame: 'hello' }, null],
    arrayDiff: [2, 'a', { stringSame: 'hello' }, null],
  }

  expect(compareObjectDiffs(before, after)).toMatchObject({
    stringDiff: {
      before: 'hello',
      after: 'goodbye',
    },
    additionalBeforeDiff: {
      before: 'additional field',
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
  })
})
