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

/** Set a localstorage value with a future expiry date that will prompt self-deletion */
function setWithExpiry(key: string, value: string, ttl: number) {
  const item = {
    value: value,
    expiry: new Date().getTime() + ttl,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

/** Get a localstorage value with an expiry date, returning value only if not expired */
function getWithExpiry(key: string): string | null {
  const itemString = window.localStorage.getItem(key)
  if (!itemString) return null

  const item = JSON.parse(itemString)
  const isExpired = new Date().getTime() > item.expiry

  if (isExpired) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}
