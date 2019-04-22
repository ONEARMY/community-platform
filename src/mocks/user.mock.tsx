import { IUser } from 'src/models/user.models'
import { toTimestamp } from 'src/utils/helpers'

export const MOCK_USER: IUser = {
  verified: true,
  userName: 'chris-m-clarke',
  _id: 'chris-m-clarke',
  _authID: '123',
  _deleted: false,
  _createdBy: '123',
  _created: toTimestamp('Friday, January 2, 2015 12:59 AM'),
  _modified: toTimestamp('Friday, January 2, 2015 12:59 AM'),
  DHSite_id: 70134,
  DHSite_mention_name: 'chris-m-clarke',
  country: '',
}
