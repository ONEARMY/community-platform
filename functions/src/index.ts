import { weeklyTasks, dailyTasks } from './exports/tasks'

import * as Admin from './admin'
import * as UserUpdates from './userUpdates'

// the following endpoints are exposed for use by various triggers
// see individual files for more informaiton
exports.weeklyTasks = weeklyTasks
exports.dailyTasks = dailyTasks

// export all integration functions as a single group
exports.integrations = require('./Integrations')
// export all userStats functions as a single group
exports.stats = require('./stats')

exports.dev = require('./dev')

exports.userUpdates = UserUpdates.handleUserUpdates
// CC Note, 2020-04-40
// folder-based naming conventions should be encourage from now on
exports.adminGetUserEmail = Admin.getUserEmail
