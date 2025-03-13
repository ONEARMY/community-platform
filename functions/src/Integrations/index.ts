import * as Discord from './firebase-discord'
import * as Slack from './firebase-slack'

exports.notifyPinAwaitingModeration = Slack.notifyPinAwaitingModeration
exports.notifyHowtoAwaitingModeration = Slack.notifyHowtoAwaitingModeration

exports.notifyPinPublished = Discord.notifyPinPublished
exports.notifyLibraryItemPublished = Discord.notifyLibraryItemPublished
exports.notifyResearchUpdatePublished = Discord.notifyResearchUpdatePublished
