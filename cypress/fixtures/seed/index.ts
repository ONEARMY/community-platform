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
export const SEED_DATA = {
  events: Object.values(events),
  howtos: Object.values(howtos),
  mappins: Object.values(mappins),
  tags: Object.values(tags),
  users: Object.values(users),
}

export const DB_PREFIX = `${randomString(5)}_`

function randomString(length: number) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
