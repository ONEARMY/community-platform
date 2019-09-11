import { api } from './exports/api'
import { weeklyTasks, dailyTasks } from './exports/tasks'
import { DH_Exports } from './DaveHakkensNL'

// the following endpoints are exposed for use by various triggers
// see individual files for more informaiton
exports.api = api
exports.weeklyTasks = weeklyTasks
exports.dailyTasks = dailyTasks
exports.DHSite_getUser = DH_Exports.DHSite_getUser
exports.DHSite_migrateAvatar = DH_Exports.DHSite_migrateAvatar
exports.DHSite_login = DH_Exports.DHSite_login
