import { HowtoStore } from './Howto/howto.store'
import { UserStore } from './User/user.store'
import { TemplateStore } from './_Template/template.store'
import { TagsStore } from './Tags/tags.store'
import { PlatformStore } from './Platform/platform.store'
import { EventStore } from './Events/events.store'
import { MapsStore } from './Maps/maps.store'
import { DatabaseV2 } from './databaseV2'

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
const stores = (rootStore: RootStore) => {
  return {
    howtoStore: new HowtoStore(rootStore),
    userStore: new UserStore(rootStore),
    templateStore: new TemplateStore(rootStore),
    tagsStore: new TagsStore(rootStore),
    platformStore: new PlatformStore(rootStore),
    eventStore: new EventStore(rootStore),
    mapsStore: new MapsStore(rootStore),
  }
}

export interface IStores {
  howtoStore: HowtoStore
  userStore: UserStore
  templateStore: TemplateStore
  tagsStore: TagsStore
  platformStore: PlatformStore
  eventStore: EventStore
  mapsStore: MapsStore
}
