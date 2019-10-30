import { ModuleStore } from '../common/module.store'
import { RootStore } from '..'
import { action, observable } from 'mobx'
import { IUser, UserRole } from 'src/models/user.models'
import { ITag } from 'src/models/tags.model'

/*********************************************************************************
 *  The admin store contains methods for updating user permissions.
 *  These are not included in the standard user store to prevent accidental exposure
 *  to regular users (only available through injected admin route)
 *********************************************************************************/
export class AdminStore extends ModuleStore {
  @observable
  public admins: IUser[] = []
  @observable
  public superAdmins: IUser[] = []
  @observable
  public tags: ITag[] = []
  constructor(rootStore: RootStore) {
    super(rootStore)
    this._init()
  }

  @action
  private async _init() {
    this.admins = await this._getUsersByRole('admin')
    this.superAdmins = await this._getUsersByRole('admin')
    console.log('tags', this.tags)
  }

  /*********************************************************************************
   *  User Admin
   *********************************************************************************/
  public async addUserRole(username: string, role: UserRole) {
    const userRef = this.db.collection<IUser>('v2_users').doc(username)
    const user = await userRef.get('server')
    if (!user) {
      throw new Error(`user with username [${username}] does not exist`)
    }
    const userRoles = user.userRoles ? user.userRoles : []
    if (!userRoles.includes(role)) {
      userRoles.push(role)
      await userRef.set({ ...user, userRoles })
      this._init()
    }
  }

  public async removeUserRole(username: string, role: UserRole) {
    const userRef = this.db.collection<IUser>('v2_users').doc(username)
    const user = await userRef.get('server')
    if (!user) {
      throw new Error(`user with username [${username}] does not exist`)
    }
    const userRoles = user.userRoles ? user.userRoles : []
    if (userRoles.includes(role)) {
      userRoles.splice(userRoles.indexOf(role), 1)
      await userRef.set({ ...user, userRoles })
      this._init()
    }
  }

  private async _getUsersByRole(role: UserRole) {
    return this.db
      .collection<IUser>('v2_users')
      .getWhere('userRoles', 'array-contains', role)
  }
}
