import { api } from './exports/api'
import { weeklyTasks, dailyTasks } from './exports/tasks'
import { DH_Exports } from './DaveHakkensNL'
import * as IntegrationsSlack from './Integrations/firebase-slack'
import * as IntegrationsDiscord from './Integrations/firebase-discord'
import { FirestoreUserRevisions } from './Firebase/userRevisions'

// the following endpoints are exposed for use by various triggers
// see individual files for more informaiton
exports.api = api
exports.weeklyTasks = weeklyTasks
exports.dailyTasks = dailyTasks
exports.DHSite_getUser = DH_Exports.DHSite_getUser
exports.DHSite_migrateAvatar = DH_Exports.DHSite_migrateAvatar
exports.DHSite_login = DH_Exports.DHSite_login
exports.notifyNewPin = IntegrationsSlack.notifyNewPin
exports.notifyNewHowTo = IntegrationsSlack.notifyNewHowTo
exports.notifyNewEvent = IntegrationsSlack.notifyNewEvent
exports.notifyPinAccepted = IntegrationsDiscord.notifyPinAccepted
exports.notifyHowToAccepted = IntegrationsDiscord.notifyHowToAccepted
exports.notifyEventAccepted = IntegrationsDiscord.notifyEventAccepted
exports.firestoreUserRevisions = FirestoreUserRevisions
