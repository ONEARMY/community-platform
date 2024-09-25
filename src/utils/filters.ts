import {
  startOfToday,
  startOfTomorrow,
  startOfWeek,
  startOfYesterday,
} from 'date-fns'

import type { ISODateString } from 'oa-shared'

/*
    Manual implementation of filters commonly used through the app
    In the future this could possibly be replaced by more comprehensive libraries
*/

/************************************************************************
 *             Array Methods
 ***********************************************************************/
/**
 * Test whether a one array contains all string values of another array
 * @param arr1 The array that will be tested, e.g ["a","b","c"]
 * @param arr2 The values to test, e.g. ["a","c"]
 */
export const includesAll = (arr1: string[], arr2: string[]) => {
  return arr1.every((val) => arr2.includes(val))
}

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

/************************************************************************
 *              Helper Methods
 ***********************************************************************/

// Take date in various formats and return as a Date object
const _formatDate = (date: dateType): Date => {
  const d: any = date
  // case date object
  return relativeDates.includes(d)
    ? _datestringToDate(date as RelativeDateString)
    : new Date(d as ISODateString)
}

// convert standard named dates (e.g. yesterday, lastweek, lastmonth) to date objects
const _datestringToDate = (str: RelativeDateString) => {
  switch (str) {
    case 'yesterday':
      return startOfYesterday()
    case 'tomorrow':
      return startOfTomorrow()
    case 'thisweek':
      return startOfWeek(new Date())
    case 'today':
      return startOfToday()
  }
}

/************************************************************************
 *             Interfaces
 ***********************************************************************/
// dates come in lots of different formats in the app, here's a general catch-all
type dateType = ISODateString | RelativeDateString
// some custom strings used to describe named dates
type RelativeDateString = 'yesterday' | 'tomorrow' | 'thisweek' | 'today'

const relativeDates: RelativeDateString[] = [
  'thisweek',
  'today',
  'tomorrow',
  'yesterday',
]
