import * as IntegrationsSlack from './firebase-slack'
import * as IntegrationsDiscord from './firebase-discord'
import * as IntegrationsPatreon from './patreon'

exports.notifyPinAwaitingModeration = IntegrationsSlack.notifyPinAwaitingModeration
exports.notifyPinPublished = IntegrationsDiscord.notifyPinPublished

exports.notifyNewHowTo = IntegrationsSlack.notifyNewHowTo
exports.notifyHowToAccepted = IntegrationsDiscord.notifyHowToAccepted

exports.notifyQuestionPublished = IntegrationsDiscord.notifyQuestionPublished

exports.patreonAuth = IntegrationsPatreon.patreonAuth
