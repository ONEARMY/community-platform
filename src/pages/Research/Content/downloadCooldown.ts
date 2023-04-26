interface localStorageExpiry {
  ResearchID: string
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

export const retrieveResearchDownloadCooldown = (
  ResearchID: string,
): localStorageExpiry | undefined => {
  const downloadCooldownArray = retrieveLocalStorageArray()
  if (downloadCooldownArray) {
    return downloadCooldownArray.find((elem) => elem.ResearchID === ResearchID)
  }
}

export const isResearchDownloadCooldownExpired = (
  ResearchCooldown: localStorageExpiry,
): boolean => {
  const now = new Date()
  if (now.getTime() > ResearchCooldown.expiry) {
    return true
  } else {
    return false
  }
}
export const createResearchExpiryObject = (
  ResearchID: string,
): localStorageExpiry => {
  const now = new Date()
  const twelveHoursInMiliseconds = 12 * 60 * 60 * 1000
  return {
    ResearchID: ResearchID,
    expiry: now.getTime() + twelveHoursInMiliseconds,
  }
}

export const addResearchDownloadCooldown = (ResearchID: string) => {
  const downloadCooldownArray = retrieveLocalStorageArray()
  const expiryObject = createResearchExpiryObject(ResearchID)

  downloadCooldownArray.push(expiryObject)
  localStorage.setItem(
    'downloadCooldown',
    JSON.stringify(downloadCooldownArray),
  )
}

export const updateResearchDownloadCooldown = (ResearchID: string) => {
  const downloadCooldownArray = retrieveLocalStorageArray()
  const expiryObject = createResearchExpiryObject(ResearchID)
  const foundIndex = downloadCooldownArray.findIndex(
    (elem) => elem.ResearchID === ResearchID,
  )

  downloadCooldownArray[foundIndex] = expiryObject
  localStorage.setItem(
    'downloadCooldown',
    JSON.stringify(downloadCooldownArray),
  )
}
