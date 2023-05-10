import { action, makeObservable, observable } from 'mobx'
import type { ITag } from 'src/models/tags.model'
import type { IUser, UserRole } from 'src/models/user.models'
import { functions } from 'src/utils/firebase'
import type { RootStore } from '..'
import { logger } from '../../logger'
import { ModuleStore } from '../common/module.store'

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
  public betaTesters: IUser[] = []
  @observable
  public tags: ITag[] = []
  // eslint-disable-next-line
  constructor(rootStore: RootStore) {
    super(rootStore)
    makeObservable(this)
  }

  /*********************************************************************************
   *  User Admin
   *********************************************************************************/
  @action
  public async init() {
    this.admins = await this._getUsersByRole('admin')
    this.superAdmins = await this._getUsersByRole('admin')
    this.betaTesters = await this._getUsersByRole('beta-tester')
  }
  public async addUserRole(username: string, role: UserRole) {
    const userRef = this.db.collection<IUser>('users').doc(username)
    const user = await userRef.get('server')
    if (!user) {
      throw new Error(`user with username [${username}] does not exist`)
    }
    const userRoles = user.userRoles ? user.userRoles : []
    if (!userRoles.includes(role)) {
      userRoles.push(role)
      await userRef.set({ ...user, userRoles })
      this.init()
    }
  }

  public async removeUserRole(username: string, role: UserRole) {
    const userRef = this.db.collection<IUser>('users').doc(username)
    const user = await userRef.get('server')
    if (!user) {
      throw new Error(`user with username [${username}] does not exist`)
    }
    const userRoles = user.userRoles ? user.userRoles : []
    if (userRoles.includes(role)) {
      userRoles.splice(userRoles.indexOf(role), 1)
      await userRef.set({ ...user, userRoles })
      this.init()
    }
  }

  /**
   * Make call to backend function to retrieve user email from auth provider
   * (as it is not stored in the database)
   */
  public async getUserEmail(user: IUser) {
    try {
      const res = await functions.httpsCallable('adminGetUserEmail')({
        uid: user._authID,
      })
      const email = res.data
      return email
    } catch (error) {
      logger.error(error)
      return `unable to get user email - ${error.message}`
    }
  }

  private async _getUsersByRole(role: UserRole) {
    return this.db
      .collection<IUser>('users')
      .getWhere('userRoles', 'array-contains', role)
  }
}
