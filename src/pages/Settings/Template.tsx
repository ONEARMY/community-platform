import { IUserPP } from 'src/models/user_pp.models'
export const INITIAL_VALUES: Partial<IUserPP> = {
  links: [
    {
      label: '',
      url: '',
    },
  ],
  openingHours: [
    {
      day: '',
      openFrom: '',
      openTo: '',
    },
  ],
}
