import { weeklyTasks, dailyTasks } from './scheduled/tasks'

import * as Admin from './admin'
import * as UserUpdates from './userUpdates'

// the following endpoints are exposed for use by various triggers
// see individual files for more information
exports.weeklyTasks = weeklyTasks
exports.dailyTasks = dailyTasks

// export all integration functions as a single group
exports.integrations = require('./Integrations')
// export all userStats functions as a single group
exports.stats = require('./stats')

exports.aggregations = require('./aggregations')

exports.userUpdates = UserUpdates.handleUserUpdates
// CC Note, 2020-04-40
// folder-based naming conventions should be encourage from now on
exports.adminGetUserEmail = Admin.getUserEmail

exports.seo = require('./seo')

exports.emailNotifications = require('./emailNotifications')

// Only export development api when working locally (with functions emulator)
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  exports.emulator = require('./emulator')
}
