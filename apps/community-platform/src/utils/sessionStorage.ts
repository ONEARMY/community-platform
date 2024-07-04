export const retrieveSessionStorageArray = (key: string) => {
  const viewsArray: string | null = sessionStorage.getItem(key)
  if (typeof viewsArray === 'string') {
    return JSON.parse(viewsArray)
  } else {
    return []
  }
}

export const addIDToSessionStorageArray = (key: string, value: string) => {
  const sessionStorageArray = retrieveSessionStorageArray(key)
  sessionStorageArray.push(value)
  sessionStorage.setItem(key, JSON.stringify(sessionStorageArray))
}
