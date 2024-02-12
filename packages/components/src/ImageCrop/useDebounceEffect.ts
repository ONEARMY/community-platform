import { useEffect } from 'react'

import type { DependencyList } from 'react'

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList,
) {
  useEffect(() => {
    // eslint-disable-next-line prefer-spread
    const t = setTimeout(() => fn.apply(undefined, deps), waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}
