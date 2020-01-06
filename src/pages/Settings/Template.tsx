import { IUserPP } from 'src/models/user_pp.models'
export const INITIAL_VALUES: Partial<IUserPP> = {
  profileType: undefined,
  workspaceType: null,
  coverImages: null,
  links: [
    {
      label: '',
      url: '',
    },
  ],
  mapPinDescription: null,
  location: null,
  about: null,
  country: null,
  openingHours: [
    {
      day: '',
      openFrom: '',
      openTo: '',
    },
  ],
  collectedPlasticTypes: null,
  machineBuilderXp: null,
  isExpert: null,
  isV4Member: null,
}
