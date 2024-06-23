import * as IntegrationsSlack from './firebase-slack'
import * as IntegrationsDiscord from './firebase-discord'
import * as IntegrationsPatreon from './patreon'

exports.notifyPinAwaitingModeration = IntegrationsSlack.notifyPinAwaitingModeration
exports.notifyPinPublished = IntegrationsDiscord.notifyPinPublished

exports.notifyHowtoAwaitingModeration = IntegrationsSlack.notifyHowtoAwaitingModeration
exports.notifyHowtoPublished = IntegrationsDiscord.notifyHowtoPublished

exports.notifyQuestionPublished = IntegrationsDiscord.notifyQuestionPublished

exports.patreonAuth = IntegrationsPatreon.patreonAuth
