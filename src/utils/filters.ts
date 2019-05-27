import { firestore } from 'firebase/app'
import dateFns from 'date-fns'
/*
    Manual implementation of filters commonly used through the app
    In the future this could possibly be replaced by more comprehensive libraries
*/

/************************************************************************
 *              Date Methods
 ***********************************************************************/
const olderThan = (chosenDate: dateType, compareToDate: dateType) => {
  const d1 = _formatDate(chosenDate)
  const d2 = _formatDate(compareToDate)
  return d1 < d2
}
const newerThan = (chosenDate: dateType, compareToDate: dateType) => {
  const d1 = _formatDate(chosenDate)
  const d2 = _formatDate(compareToDate)
  return d1 > d2
}

/************************************************************************
 *              Exports
 ***********************************************************************/
export default { olderThan, newerThan }

// tslint:disable variable-name
/************************************************************************
 *              Helper Methods
 ***********************************************************************/

// Take date in various formats and return as a Date object
const _formatDate = (date: Date | datestring | firestore.Timestamp) => {
  const d: any = date
  // case date object
  return date instanceof Date
    ? date
    : // case datestring
    typeof date === 'string'
    ? _datestringToDate(date as datestring)
    : // case timestamp
    date instanceof firestore.Timestamp
    ? _timestampToDate(date as firestore.Timestamp)
    : // case other - should not be reached
      (d as Date)
}
const _timestampToDate = (timestamp: firestore.Timestamp) => {
  return timestamp.toDate()
}
// convert standard named dates (e.g. yesterday, lastweek, lastmonth) to date objects
const _datestringToDate = (str: datestring) => {
  switch (str) {
    case 'yesterday':
      return dateFns.startOfYesterday()
    case 'tomorrow':
      return dateFns.startOfTomorrow()
    case 'thisweek':
      return dateFns.startOfWeek(new Date())
    case 'today':
      return dateFns.startOfToday()
  }
}

/************************************************************************
 *             Interfaces
 ***********************************************************************/
// dates come in lots of different formats in the app, here's a general catch-all
type dateType = Date | datestring | firestore.Timestamp
// some custom strings used to describe named dates
type datestring = 'yesterday' | 'tomorrow' | 'thisweek' | 'today'
