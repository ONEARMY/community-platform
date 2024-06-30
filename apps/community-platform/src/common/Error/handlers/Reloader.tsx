/**
 * Check whether the current browser session has already been reloaded
 * in the past 10s
 */
export const isReloaded = () => (getWithExpiry('error_reload') ? true : false)

/** Reload the browser if it has not already been recently reloaded (avoid infinite loops) */
export const attemptReload = () => {
  if (!isReloaded()) {
    setWithExpiry('error_reload', 'true', 10000)
    window.location.reload()
  }
}

/**
 * Set a sessionStorage value with a future expiry date that will prompt self-deletion
 * even if page session not closed (i.e. tab left open)
 **/
const setWithExpiry = (key: string, value: string, ttl: number) => {
  const item = {
    value: value,
    expiry: new Date().getTime() + ttl,
  }
  sessionStorage.setItem(key, JSON.stringify(item))
}

/** Get a sessionStorage value with an expiry date, returning value only if not expired */
const getWithExpiry = (key: string): string | null => {
  const itemString = window.sessionStorage.getItem(key)
  if (!itemString) return null

  const item = JSON.parse(itemString)
  const isExpired = new Date().getTime() > item.expiry

  if (isExpired) {
    sessionStorage.removeItem(key)
    return null
  }

  return item.value
}
