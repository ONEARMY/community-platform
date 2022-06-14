interface localStorageExpiry {
  howtoID: string
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

export const retrieveHowtoDownloadCooldown = (
  howtoID: string,
): localStorageExpiry | undefined => {
  const downloadCooldownArray = retrieveLocalStorageArray()
  if (downloadCooldownArray) {
    return downloadCooldownArray.find((elem) => elem.howtoID === howtoID)
  }
}

export const isHowtoDownloadCooldownExpired = (
  howtoCooldown: localStorageExpiry,
): boolean => {
  const now = new Date()
  if (now.getTime() > howtoCooldown.expiry) {
    return true
  } else {
    return false
  }
}
export const createHowtoExpiryObject = (
  howtoID: string,
): localStorageExpiry => {
  const now = new Date()
  const twelveHoursInMiliseconds = 12 * 60 * 60 * 1000
  return {
    howtoID: howtoID,
    expiry: now.getTime() + twelveHoursInMiliseconds,
  }
}

export const addHowtoDownloadCooldown = (howtoID: string) => {
  const downloadCooldownArray = retrieveLocalStorageArray()
  const expiryObject = createHowtoExpiryObject(howtoID)

  downloadCooldownArray.push(expiryObject)
  localStorage.setItem(
    'downloadCooldown',
    JSON.stringify(downloadCooldownArray),
  )
}

export const updateHowtoDownloadCooldown = (howtoID: string) => {
  const downloadCooldownArray = retrieveLocalStorageArray()
  const expiryObject = createHowtoExpiryObject(howtoID)
  const foundIndex = downloadCooldownArray.findIndex(
    (elem) => elem.howtoID === howtoID,
  )

  downloadCooldownArray[foundIndex] = expiryObject
  localStorage.setItem(
    'downloadCooldown',
    JSON.stringify(downloadCooldownArray),
  )
}
