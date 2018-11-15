import { DocStore } from './Docs/docs.store'
import { UserStore } from './User/user.store'
import { TemplateStore } from './_Template/template.store'
import { TagsStore } from './Tags/tags.store'
import { PlatformStore } from './Platform/platform.store'

// the following stores are passed into a top level app provider and can be accessed through @inject
export const stores = {
  docStore: new DocStore(),
  userStore: new UserStore(),
  templateStore: new TemplateStore(),
  tagsStore: new TagsStore(),
  platformStore: new PlatformStore(),
}

export interface IStores {
  docStore: DocStore
  userStore: UserStore
  templateStore: TemplateStore
  tagsStore: TagsStore
  platformStore: PlatformStore
}
