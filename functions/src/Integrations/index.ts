import * as IntegrationsSlack from './firebase-slack'
import * as IntegrationsPatreon from './patreon'

exports.notifyNewPin = IntegrationsSlack.notifyNewPin
exports.notifyNewHowTo = IntegrationsSlack.notifyNewHowTo
exports.patreonAuth = IntegrationsPatreon.patreonAuth
