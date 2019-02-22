import { HowtoStore } from './Howto/howto.store'
import { UserStore } from './User/user.store'
import { TemplateStore } from './_Template/template.store'
import { TagsStore } from './Tags/tags.store'
import { PlatformStore } from './Platform/platform.store'
import { EventStore } from './Events/events.store'
import { DiscussionsStore } from './Discussions/discussions.store'

// the following stores are passed into a top level app provider and can be accessed through @inject
export const stores = {
  howtoStore: new HowtoStore(),
  userStore: new UserStore(),
  templateStore: new TemplateStore(),
  tagsStore: new TagsStore(),
  platformStore: new PlatformStore(),
  eventStore: new EventStore(),
  discussionsStore: new DiscussionsStore(),
}

export interface IStores {
  howtoStore: HowtoStore
  userStore: UserStore
  templateStore: TemplateStore
  tagsStore: TagsStore
  platformStore: PlatformStore
  eventStore: EventStore
  discussionsStore: DiscussionsStore
}
