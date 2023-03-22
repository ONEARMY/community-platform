import type { IUserPP } from 'src/models/userPreciousPlastic.models'
import type { IUser } from 'src/models/user.models'
import { ProfileType } from 'src/modules/profile/types'

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
}

// use default export to avoid naming confusion
export default USER_PP_TEMPLATE
