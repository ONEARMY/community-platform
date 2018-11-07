import { DocStore } from './Docs/docs.store'
import { UserStore } from './User/user.store'

// the following stores are passed into a top level app provider and can be accessed through @inject
export const stores = {
  docStore: new DocStore(),
  userStore: new UserStore(),
}
