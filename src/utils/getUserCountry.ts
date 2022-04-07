import { IUser } from 'src/models/user.models'

export function getUserCountry(user: IUser) {
  const userCountry =
    user.country?.toLowerCase() ||
    user.location?.countryCode?.toLowerCase() ||
    ''

  return userCountry
}
