/**
 * Take a given array length n and split into an array of arrays, each with a maximum
 * length provided by @param chunksize
 */
export function splitArrayToChunks<T>(arr: T[], chunksize: number): T[][] {
    const chunkedArrays = []
    for (let i = 0; i < arr.length; i += chunksize) {
        const chunk = arr.slice(i, i + chunksize);
        chunkedArrays.push(chunk)
    }
    return chunkedArrays
}