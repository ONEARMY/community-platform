import type { IUser } from 'src/models/user.models'

export const getUserCountry = (user: IUser) =>
  user.country?.toLowerCase() || user.location?.countryCode?.toLowerCase() || ''
