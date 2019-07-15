import { IUser } from 'src/models/user.models'
import { toTimestamp } from 'src/utils/helpers'

export const MOCK_USER: IUser = {
  verified: true,
  userName: 'chris-m-clarke',
  _id: 'chris-m-clarke',
  _authID: '123',
  _deleted: false,
  _createdBy: '123',
  _created: toTimestamp(new Date()),
  _modified: toTimestamp(new Date()),
  _lastActive: toTimestamp(new Date()),
  country: '',
  DHSite_id: 70134,
  DHSite_mention_name: 'chris-m-clarke',
}
