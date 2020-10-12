import { api } from './exports/api'
import { weeklyTasks, dailyTasks } from './exports/tasks'
import { DH_Exports } from './DaveHakkensNL'
import * as IntegrationsSlack from './Integrations/firebase-slack'
import * as IntegrationsDiscord from './Integrations/firebase-discord'
import * as IntegrationsEmail from './Integrations/firebase-email'
import * as UserStats from './userStats'
import * as Admin from './admin'
import * as UserUpdates from './userUpdates'

// the following endpoints are exposed for use by various triggers
// see individual files for more informaiton
exports.api = api
exports.weeklyTasks = weeklyTasks
exports.dailyTasks = dailyTasks
// TODO - DH integrations should be deprecated
exports.DHSite_getUser = DH_Exports.DHSite_getUser
exports.DHSite_migrateAvatar = DH_Exports.DHSite_migrateAvatar
exports.DHSite_login = DH_Exports.DHSite_login
exports.notifyNewPin = IntegrationsSlack.notifyNewPin
exports.notifyNewHowTo = IntegrationsSlack.notifyNewHowTo
exports.notifyNewEvent = IntegrationsSlack.notifyNewEvent
exports.notifyPinAccepted = IntegrationsDiscord.notifyPinAccepted
exports.notifyHowToAccepted = IntegrationsDiscord.notifyHowToAccepted
exports.notifyEventAccepted = IntegrationsDiscord.notifyEventAccepted
exports.emailNotificationDemo = IntegrationsEmail.notifyEmailDemo
// TODO - migrate function should be removed after complete
exports.userStatsMigrate = UserStats.migrateUserStats
exports.userStatsCountEvents = UserStats.countEvents
exports.userStatsCountHowTos = UserStats.countHowTos
exports.userUpdates = UserUpdates.handleUserUpdates
// CC Note, 2020-04-40
// folder-based naming conventions should be encourage from now on
exports.adminGetUserEmail = Admin.getUserEmail
