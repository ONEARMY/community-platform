import * as IntegrationsSlack from './firebase-slack'
import * as IntegrationsDiscord from './firebase-discord'
import * as IntegrationsEmail from './firebase-email'

exports.notifyNewPin = IntegrationsSlack.notifyNewPin
exports.notifyNewHowTo = IntegrationsSlack.notifyNewHowTo
exports.notifyNewEvent = IntegrationsSlack.notifyNewEvent
exports.notifyPinAccepted = IntegrationsDiscord.notifyPinAccepted
exports.notifyHowToAccepted = IntegrationsDiscord.notifyHowToAccepted
exports.notifyEventAccepted = IntegrationsDiscord.notifyEventAccepted
exports.emailNotificationDemo = IntegrationsEmail.notifyEmailDemo
