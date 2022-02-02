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
 * Compare two json objects nested one level deep for equality (key order not important)
 * Adapted from https://stackoverflow.com/a/52323412/5693245
 * */
export function shallowCompareObjectsEqual(obj1: any, obj2: any) {
  return (
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every(
      key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key],
    )
  )
}
