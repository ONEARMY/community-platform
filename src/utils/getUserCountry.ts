import type { IUser } from 'oa-shared'

export const getUserCountry = (user: IUser): string => {
  const userCountry =
    user.country?.toLowerCase() ||
    user.location?.countryCode?.toLowerCase() ||
    ''

  return userCountry
}
