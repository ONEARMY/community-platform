import { IUserPP } from 'src/models/user_pp.models'
export const INITIAL_VALUES: Partial<IUserPP> = {
  profileType: undefined,
  workspaceType: undefined,
  coverImages: undefined,
  links: [
    {
      label: '',
      url: '',
    },
  ],
  mapPinDescription: undefined,
  location: undefined,
  about: undefined,
  country: undefined,
  openingHours: [
    {
      day: '',
      openFrom: '',
      openTo: '',
    },
  ],
  collectedPlasticTypes: undefined,
  machineBuilderXp: undefined,
  isExpert: undefined,
  isV4Member: undefined,
}
