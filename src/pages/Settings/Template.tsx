import { IUserPP } from 'src/models/user_pp.models'
import { IUser } from 'src/models/user.models'

// when using the user settings page a base user will already exist
// pass an empty object with IUser interface for purpose of future typings
const BASE_USER = {} as IUser

const USER_PP_TEMPLATE: IUserPP = {
  ...BASE_USER,
  profileType: 'member',
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
