import { ILegacyUser, IUser } from 'src/models/user.models'
import { toTimestamp } from 'src/utils/helpers'

export const MOCK_USER: IUser = {
  verified: true,
  _id: '123',
  _deleted: false,
  _createdBy: '123',
  _created: toTimestamp('Friday, January 2, 2015 12:59 AM'),
  _modified: toTimestamp('Friday, January 2, 2015 12:59 AM'),
  legacy_id: 70134,
  email: 'chris.m.clarke@live.co.uk',
  legacy_registered: '14/09/2018 14:45',
  display_name: 'Chris Clarke',
  first_name: 'Chris',
  last_name: 'Clarke',
  nickname: 'Chris Clarke',
  country: '',
}

export const LEGACY_USERS: ILegacyUser[] = [
  {
    legacy_id: 70134,
    login: 'chris.m.clarke',
    password: '$P$BZlfBsPNhtbN32ihan7gK///84K38M.',
    password_alg: 'phpass',
    email: 'chris.m.clarke@live.co.uk',
    legacy_registered: '14/09/2018 14:45',
    display_name: 'Chris Clarke',
    first_name: 'Chris',
    last_name: 'Clarke',
    nickname: 'Chris Clarke',
    country: '',
  },
  {
    legacy_id: 1,
    login: 'davehakkens',
    password: '$P$BAoQ6tqDBVjBHz.qYHkjcsuRQr7RZe.',
    password_alg: 'phpass',
    email: 'mail@davehakkens.nl',
    legacy_registered: '15/11/2013 18:23',
    display_name: 'Dave Hakkens',
    first_name: 'davehakkens',
    last_name: 'Hakkens',
    nickname: 'Dave Hakkens',
    country: 'Netherlands',
  },
]
