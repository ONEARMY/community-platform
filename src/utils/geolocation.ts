/**
 * Prompt browser to access users location and pass back as Position object
 * Rejects on error or non-supported browser
 */
export const GetLocation = async (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve(position)
        },
        error => {
          reject(error.message)
        },
      )
    } else {
      reject('Geolocation not supported')
    }
  })
}
