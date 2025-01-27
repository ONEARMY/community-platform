interface localStorageExpiry {
  id: string
  expiry: number
}

export const retrieveLocalStorageArray = (): localStorageExpiry[] => {
  const downloadCooldownArray: string | null =
    localStorage.getItem('downloadCooldown')
  if (typeof downloadCooldownArray === 'string') {
    return JSON.parse(downloadCooldownArray)
  } else {
    return new Array<localStorageExpiry>()
  }
}

export const retrieveLibraryDownloadCooldown = (
  id: string,
): localStorageExpiry | undefined => {
  const downloadCooldownArray = retrieveLocalStorageArray()
  if (downloadCooldownArray) {
    return downloadCooldownArray.find((elem) => elem.id === id)
  }
}

export const isLibraryDownloadCooldownExpired = (
  cooldown: localStorageExpiry,
): boolean => {
  const now = new Date()
  if (now.getTime() > cooldown.expiry) {
    return true
  } else {
    return false
  }
}

export const CreateLibraryExpiryObject = (id: string): localStorageExpiry => {
  const now = new Date()
  const twelveHoursInMiliseconds = 12 * 60 * 60 * 1000
  return {
    id,
    expiry: now.getTime() + twelveHoursInMiliseconds,
  }
}

export const addLibraryDownloadCooldown = (id: string) => {
  const downloadCooldownArray = retrieveLocalStorageArray()
  const expiryObject = CreateLibraryExpiryObject(id)

  downloadCooldownArray.push(expiryObject)
  localStorage.setItem(
    'downloadCooldown',
    JSON.stringify(downloadCooldownArray),
  )
}

export const updateLibraryDownloadCooldown = (id: string) => {
  const downloadCooldownArray = retrieveLocalStorageArray()
  const expiryObject = CreateLibraryExpiryObject(id)
  const foundIndex = downloadCooldownArray.findIndex((elem) => elem.id === id)

  downloadCooldownArray[foundIndex] = expiryObject
  localStorage.setItem(
    'downloadCooldown',
    JSON.stringify(downloadCooldownArray),
  )
}
