import { observable, action } from 'mobx'
import { db } from '../../utils/firebase'
import { IUser } from 'src/models/models'

export class UserStore {
  @observable
  public user: IUser

  @action
  public async getUser() {
    // const ref = await db.collection('tutorials').get()
    // this.docs = ref.docs.map(doc => doc.data())
  }
}
