import { api } from './exports/api'
import { weeklyTasks, dailyTasks } from './exports/tasks'
import { DHSite_getUser, DHSite_migrateAvatar } from './exports/dhsite'

// the following endpoints are exposed for use by various triggers
// see individual files for more informaiton
exports.api = api
exports.weeklyTasks = weeklyTasks
exports.dailyTasks = dailyTasks
exports.DHSite_getUser = DHSite_getUser
exports.DHSite_migrateAvatar = DHSite_migrateAvatar
