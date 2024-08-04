import { ProfileType } from 'src/modules/profile/types'
import { DEFAULT_PUBLIC_CONTACT_PREFERENCE } from 'src/pages/UserSettings/constants'

import type { IUser } from 'src/models/user.models'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'

// when using the user settings page a base user will already exist
// pass an empty object with IUser interface for purpose of future typings
const BASE_USER = {} as IUser

const USER_PP_TEMPLATE: IUserPP = {
  ...BASE_USER,
  profileType: ProfileType.MEMBER,
  coverImages: [],
  links: [],
  about: null,
  country: null,
  openingHours: [],
  workspaceType: null,
  collectedPlasticTypes: null,
  machineBuilderXp: null,
  isExpert: null,
  isV4Member: null,
  isContactableByPublic: DEFAULT_PUBLIC_CONTACT_PREFERENCE,
}

// use default export to avoid naming confusion
export default USER_PP_TEMPLATE
