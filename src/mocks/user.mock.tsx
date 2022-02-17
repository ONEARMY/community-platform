/* eslint-disable @typescript-eslint/naming-convention*/
import { IUser } from 'src/models/user.models'
import { MOCK_DB_META } from './db.mock'

export const MOCK_USER: IUser = {
  verified: true,
  badges: { verified: true },
  userName: 'chris-m-clarke',
  displayName: 'chris-m-clarke',
  moderation: 'accepted',
  ...MOCK_DB_META(),
  _authID: '123',
  DHSite_id: 70134,
  DHSite_mention_name: 'chris-m-clarke',
  country: '',
  coverImages: [],
  links: [],
  votedUsefulHowtos: {},
}
