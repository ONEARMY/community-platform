import { IUserPP } from 'src/models/user_pp.models'

const INITIAL_VALUES: Partial<IUserPP> = {
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

export default {
  INITIAL_VALUES,
}
