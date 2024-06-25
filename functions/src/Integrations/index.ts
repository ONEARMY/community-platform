import * as Slack from './firebase-slack'
import * as Discord from './firebase-discord'
import * as Patreon from './patreon'

exports.notifyPinAwaitingModeration = Slack.notifyPinAwaitingModeration
exports.notifyHowtoAwaitingModeration = Slack.notifyHowtoAwaitingModeration

exports.notifyPinPublished = Discord.notifyPinPublished
exports.notifyHowtoPublished = Discord.notifyHowtoPublished
exports.notifyQuestionPublished = Discord.notifyQuestionPublished
exports.notifyResearchUpdatePublished = Discord.notifyResearchUpdatePublished

exports.patreonAuth = Patreon.patreonAuth
