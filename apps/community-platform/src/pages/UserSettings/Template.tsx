import { ProfileType } from '../../modules/profile/types'
import { DEFAULT_PUBLIC_CONTACT_PREFERENCE } from '../../pages/UserSettings/constants'

import type { IUser } from '../../models/user.models'
import type { IUserPP } from '../../models/userPreciousPlastic.models'

// when using the user settings page a base user will already exist
// pass an empty object with IUser interface for purpose of future typings
const BASE_USER = {} as IUser

const USER_PP_TEMPLATE: IUserPP = {
  ...BASE_USER,
  profileType: ProfileType.MEMBER,
  coverImages: [],
  links: [],
  location: null,
  about: null,
  country: null,
  openingHours: [],
  mapPinDescription: null,
  workspaceType: null,
  collectedPlasticTypes: null,
  machineBuilderXp: null,
  isExpert: null,
  isV4Member: null,
  notification_settings: undefined,
  isContactableByPublic: DEFAULT_PUBLIC_CONTACT_PREFERENCE,
}

// use default export to avoid naming confusion
export default USER_PP_TEMPLATE
