import { HowtoStore } from './Howto/howto.store'
import { UserStore } from './User/user.store'
import { TemplateStore } from './_Template/template.store'
import { TagsStore } from './Tags/tags.store'
import { PlatformStore } from './Platform/platform.store'
import { EventStore } from './Events/events.store'
import { MapsStore } from './Maps/maps.store'
import { DatabaseV2 } from './databaseV2'
import { MobileMenuStore } from './MobileMenu/mobilemenu.store'
import { AdminStore } from './Admin/admin.store'
import { ThemeStore } from './Theme/theme.store'

export class RootStore {
  dbV2 = new DatabaseV2()
  stores: IStores
  constructor() {
    this.stores = stores(this)
  }
}

// the following stores are passed into a top level app provider and can be accessed through @inject
// all stores are also shared a top-level root store, which provides access to the main database and
// all other stores if required. More info on this pattern can be found at: https://mobx.js.org/best/store.html

// NOTE - As all stores are injected at the same time it is best to avoid using many constructor methods
// as these will be called immediately, and instead use init() or similar methods that can be called
// from a page (see common/module store for example)
const stores = (rootStore: RootStore) => {
  return {
    howtoStore: new HowtoStore(rootStore),
    userStore: new UserStore(rootStore),
    templateStore: new TemplateStore(rootStore),
    tagsStore: new TagsStore(rootStore),
    platformStore: new PlatformStore(rootStore),
    mobileMenuStore: new MobileMenuStore(rootStore),
    eventStore: new EventStore(rootStore),
    mapsStore: new MapsStore(rootStore),
    adminStore: new AdminStore(rootStore),
    themeStore: new ThemeStore(),
  }
}

export interface IStores {
  howtoStore: HowtoStore
  userStore: UserStore
  templateStore: TemplateStore
  tagsStore: TagsStore
  platformStore: PlatformStore
  mobileMenuStore: MobileMenuStore
  eventStore: EventStore
  mapsStore: MapsStore
  adminStore: AdminStore
  themeStore: ThemeStore
}
