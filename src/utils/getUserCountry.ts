import type { IUser } from 'src/models/user.models'

export const getUserCountry = (user: IUser): string => {
  const userCountry =
    user.country?.toLowerCase() ||
    user.location?.countryCode?.toLowerCase() ||
    ''

  return userCountry
}
