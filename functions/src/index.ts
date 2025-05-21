import { dailyTasks } from './scheduled/tasks'

import * as Admin from './admin'
import * as UserUpdates from './userUpdates'
import * as SupabaseSync from './supabaseSync'

// the following endpoints are exposed for use by various triggers
// see individual files for more information
exports.dailyTasks = dailyTasks

// export all integration functions as a single group
exports.integrations = require('./Integrations')

exports.database = require('./database')

exports.userUpdates = UserUpdates.handleUserUpdates

exports.supabaseProfileUpdate = SupabaseSync.supabaseProfileUpdate

// CC Note, 2020-04-40
// folder-based naming conventions should be encourage from now on
exports.adminGetUserEmail = Admin.getUserEmail

exports.emailNotifications = require('./emailNotifications')

// Only export development api when working locally (with functions emulator)
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  exports.emulator = require('./emulator')
}

// Only log to cloud if not running locally
if (process.env.FUNCTIONS_EMULATOR !== 'true') {
  exports.logToCloudLogging = require('./logging/logging')
}
