import { DBEndpoint } from '../../support/db/endpoints'

import events from './events.json'
import howtos from './howtos.json'
import mappins from './mappins.json'
import tags from './tags.json'
import users from './users.json'

/**
 * Seed data is used to populate a common initial state
 * Individual datasets can be found in the corresponding json files
 * @remark they are in object format instead of array to allow easier
 * import/export using scripts for firebase
 */
export const SEED_DATA: { [key in DBEndpoint]: any[] } = {
  events: Object.values(events),
  howtos: Object.values(howtos),
  mappins: Object.values(mappins),
  research: [],
  tags: Object.values(tags),
  users: Object.values(users),
}
