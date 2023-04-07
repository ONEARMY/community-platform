export const setDatabasePrefix = (dbPrefix) => {
  if (window.location.hostname === '127.0.0.1') {
    window.sessionStorage.setItem('DB_PREFIX', dbPrefix)
    console.log(`Init script:`, {
      DB_PREFIX: window.sessionStorage.getItem('DB_PREFIX'),
    })
  }
}
