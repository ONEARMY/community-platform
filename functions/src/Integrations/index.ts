import * as IntegrationsSlack from './firebase-slack'
import * as IntegrationsDiscord from './firebase-discord'

exports.notifyNewPin = IntegrationsSlack.notifyNewPin
exports.notifyNewHowTo = IntegrationsSlack.notifyNewHowTo
exports.notifyPinAccepted = IntegrationsDiscord.notifyPinAccepted
exports.notifyHowToAccepted = IntegrationsDiscord.notifyHowToAccepted
