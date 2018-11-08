import { observable, action } from 'mobx'
import { IUser } from 'src/models/models'

export class UserStore {
  @observable
  public user: IUser

  @action
  public updateUser(user: IUser) {
    this.user = user
  }
}
