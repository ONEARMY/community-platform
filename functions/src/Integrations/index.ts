import * as IntegrationsSlack from './firebase-slack'
import * as IntegrationsDiscord from './firebase-discord'
import * as IntegrationsPatreon from './patreon'

exports.notifyNewPin = IntegrationsSlack.notifyNewPin
exports.notifyPinAccepted = IntegrationsDiscord.notifyPinAccepted

exports.notifyNewHowTo = IntegrationsSlack.notifyNewHowTo
exports.notifyHowToAccepted = IntegrationsDiscord.notifyHowToAccepted

exports.notifyAcceptedQuestion = IntegrationsDiscord.notifyAcceptedQuestion

exports.patreonAuth = IntegrationsPatreon.patreonAuth
