/**
 * Take a given array length n and split into an array of arrays, each with a maximum
 * length provided by @param chunksize
 */
export function splitArrayToChunks<T>(arr: T[], chunksize: number): T[][] {
  const chunkedArrays = []
  for (let i = 0; i < arr.length; i += chunksize) {
    const chunk = arr.slice(i, i + chunksize)
    chunkedArrays.push(chunk)
  }
  return chunkedArrays
}

/**
 * Deep compare two objects
 * @returns object containing list of fields with diffs, and before/after values
 * @example
 * ```
 * compareObjectDiffs({a:"hello",b:"same"},{a:"goodbye",b:"same"})
 *
 * {a:{before:"hello",after:"goodbye"}}
 * ```
 *
 */
export function compareObjectDiffs(beforeObj: any = {}, afterObj: any = {}) {
  const diffs: { [key: string]: { before: any; after: any } } = {}
  //   extract a list of all keys within either before or after object
  const uniqueKeys = Object.keys(beforeObj).concat(
    Object.keys(afterObj).filter(k => !beforeObj.hasOwnProperty(k)),
  )
  uniqueKeys.forEach(key => {
    const beforeVal = beforeObj[key]
    const afterVal = afterObj[key]
    if (!valuesAreDeepEqual(beforeVal, afterVal)) {
      diffs[key] = { before: beforeVal, after: afterVal }
    }
  })
  return diffs
}

/**
 * Compare two values (including arrays and json objects), and
 * assert if deeply equal (recursively for arrays and json objects)
 */
export function valuesAreDeepEqual(a: any, b: any) {
  const aType = typeof a
  const bType = typeof b
  // handle type mismatch
  if (aType !== bType) return false
  // handle all falsy types (null, undefined)
  if (!a || !b) {
    return a === b
  }
  // handle arrays
  if (Array.isArray(a) || Array.isArray(b)) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((v, i) => valuesAreDeepEqual(v, b[i]))
    )
  }
  // handle json objects
  if (
    aType === 'object' &&
    a.constructor === b.constructor &&
    a.constructor === {}.constructor
  ) {
    return (
      Object.keys(a).length === Object.keys(b).length &&
      Object.keys(a).every(key => valuesAreDeepEqual(a[key], b[key]))
    )
  }
  // handle rest
  return a === b
}
