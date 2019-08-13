import { IUser } from 'src/models/user.models'

const INITIAL_VALUES: Partial<IUser> = {
  links: [
    {
      label: '',
      url: '',
    },
  ],
}

export default {
  INITIAL_VALUES,
}
