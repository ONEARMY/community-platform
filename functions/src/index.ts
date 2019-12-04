import { api } from './exports/api'
import { weeklyTasks, dailyTasks } from './exports/tasks'
import { DH_Exports } from './DaveHakkensNL'
import * as Integrations from './Integrations/firebase-slack'

// the following endpoints are exposed for use by various triggers
// see individual files for more informaiton
exports.api = api
exports.weeklyTasks = weeklyTasks
exports.dailyTasks = dailyTasks
exports.DHSite_getUser = DH_Exports.DHSite_getUser
exports.DHSite_migrateAvatar = DH_Exports.DHSite_migrateAvatar
exports.DHSite_login = DH_Exports.DHSite_login
exports.notifyNewPin = Integrations.notifyNewPin
exports.notifyNewHowTo = Integrations.notifyNewHowTo
exports.notifyNewEvent = Integrations.notifyNewEvent
