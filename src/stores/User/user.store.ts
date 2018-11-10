import { observable, action } from 'mobx'
import { IUser } from 'src/models/models'

export class UserStore {
  @observable
  public user: IUser | undefined

  @action
  public updateUser(user?: IUser) {
    if (user) {
      this.user = user
    } else {
      this.user = undefined
    }
  }
}
