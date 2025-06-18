import { DatabaseV2 } from './databaseV2/DatabaseV2'
import { MapsStore } from './Maps/maps.store'
import { TagsStore } from './Tags/tags.store'
import { UserNotificationsStore } from './User/notifications.store'
import { UserStore } from './User/user.store'

export interface IRootStore {
  dbV2: DatabaseV2
  stores: IStores
}

export interface IStores {
  userStore: UserStore
  mapsStore: MapsStore
  tagsStore: TagsStore
  userNotificationsStore: UserNotificationsStore
}

export class RootStore implements IRootStore {
  dbV2 = new DatabaseV2()
  stores = stores(this)
}

// The following stores are passed into a top level app provider and can be accessed through @inject
// all stores are also shared a top-level root store, which provides access to the main database and
// all other stores if required.
// More info on this pattern can be found at:
// https://mobx.js.org/defining-data-stores.html#combining-multiple-stores

// NOTE - As all stores are injected at the same time it is best to avoid using many constructor methods
// as these will be called immediately, and instead use init() or similar methods that can be called
// from a page (see common/module store for example)
const stores = (rootStore: IRootStore) => {
  const stores: IStores = {
    userStore: new UserStore(rootStore),
    mapsStore: new MapsStore(rootStore),
    tagsStore: new TagsStore(rootStore),
    userNotificationsStore: new UserNotificationsStore(rootStore),
  }
  return stores
}
