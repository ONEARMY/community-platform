import { dailyTasks } from './scheduled/tasks'

import * as Admin from './admin'
import * as UserUpdates from './userUpdates'
import * as DiscussionUpdates from './discussionUpdates'
import * as QuestionUpdates from './questionUpdates'
import * as SupabaseSync from './supabaseSync'
import * as Messages from './messages/messages'

// the following endpoints are exposed for use by various triggers
// see individual files for more information
exports.dailyTasks = dailyTasks

// export all integration functions as a single group
exports.integrations = require('./Integrations')

exports.aggregations = require('./aggregations')

exports.database = require('./database')

exports.userUpdates = UserUpdates.handleUserUpdates

exports.discussionUpdates = DiscussionUpdates.handleDiscussionUpdate

exports.questionCreate = QuestionUpdates.handleQuestionCreate
exports.questionUpdate = QuestionUpdates.handleQuestionUpdate
exports.questionDelete = QuestionUpdates.handleQuestionDelete
exports.supabaseProfileUpdate = SupabaseSync.supabaseProfileUpdate

// CC Note, 2020-04-40
// folder-based naming conventions should be encourage from now on
exports.adminGetUserEmail = Admin.getUserEmail

exports.sendMessage = Messages.sendMessage
exports.emailNotifications = require('./emailNotifications')

// Only export development api when working locally (with functions emulator)
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  exports.emulator = require('./emulator')
}

// Only log to cloud if not running locally
if (process.env.FUNCTIONS_EMULATOR !== 'true') {
  exports.logToCloudLogging = require('./logging/logging')
}
