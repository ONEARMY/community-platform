import { isObservableObject, toJS } from 'mobx'
import type { DBDoc, IModerable } from 'src/models/common.models'
import type { IMapPin } from 'src/models/maps.models'
import type { IUser } from 'src/models/user.models'

// remove special characters from string, also replacing spaces with dashes
export const stripSpecialCharacters = (text: string) => {
  return text
    ? text
        .split(' ')
        .join('-')
        .replace(/[^a-zA-Z0-9_-]/gi, '')
    : ''
}

// convert to lower case and remove any special characters
export const formatLowerNoSpecial = (text: string) => {
  return stripSpecialCharacters(text).toLowerCase()
}

// take an array of objects and convert to an single object, using a unique key
// that already exists in the array element, i.e.
// [{id:'abc',val:'hello'},{id:'def',val:'world'}] = > {abc:{id:abc,val:'hello}, def:{id:'def',val:'world'}}
export const arrayToJson = (arr: any[], keyField: string) => {
  const json = {}
  arr.forEach((el) => {
    if (Object.prototype.hasOwnProperty.call(el, keyField)) {
      const key = el[keyField]
      json[key] = el
    }
  })
  return json
}

// Take a string and capitalises the first letter
// hello world => Hello world
export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

/** Show only items which are either accepted, the user has created, or an admin can see
 * HACK - ARH - 2019/12/11 filter unaccepted howtos, should be done serverside
 */
export const filterModerableItems = <T>(
  items: (IModerable & T)[],
  user?: IUser,
): T[] =>
  items.filter((item) => {
    const isItemAccepted = item.moderation === 'accepted'
    const wasCreatedByUser = user && item._createdBy === user.userName
    const isAdminAndAccepted =
      hasAdminRights(user) &&
      item.moderation !== 'draft' &&
      item.moderation !== 'rejected'

    return isItemAccepted || wasCreatedByUser || isAdminAndAccepted
  })

/**
 *  Function used to generate random ID in same manner as firestore
 */
export const randomID = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let autoId = ''
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return autoId
}

/************************************************************************
 *              Date Methods
 ***********************************************************************/
export const getMonth = (d: Date, monthType: 'long' | 'short' = 'long') => {
  // use ECMAScript Internationalization API to return month
  return `${d.toLocaleString('en-us', { month: monthType })}`
}
export const getDay = (d: Date) => {
  return `${d.getDate()}`
}

export const hasAdminRights = (user?: IUser) => {
  if (!user) {
    return false
  }
  if (isObservableObject(user)) {
    user = toJS(user)
  }

  const roles =
    user.userRoles && Array.isArray(user.userRoles) ? user.userRoles : []

  if (roles.includes('admin') || roles.includes('super-admin')) {
    return true
  } else {
    return false
  }
}

export const needsModeration = (doc: IModerable, user?: IUser) => {
  if (!hasAdminRights(user)) {
    return false
  }
  return doc.moderation !== 'accepted'
}

export const isAllowToEditContent = (
  doc: IEditableDoc & { collaborators?: string[] },
  user?: IUser,
) => {
  if (!user) {
    return false
  }
  if (isObservableObject(user)) {
    user = toJS(user)
  }

  if (doc.collaborators?.includes(user.userName)) {
    return true
  }

  if (
    hasAdminRights(user) ||
    (doc._createdBy && doc._createdBy === user.userName)
  ) {
    return true
  } else {
    return false
  }
}

export const isAllowToDeleteContent = (doc: IEditableDoc, user?: IUser) => {
  if (!user) {
    return false
  }

  if (isObservableObject(user)) {
    user = toJS(user)
  }

  const roles =
    user.userRoles && Array.isArray(user.userRoles) ? user.userRoles : []

  if (
    roles.includes('admin') ||
    roles.includes('super-admin') ||
    (doc._createdBy && doc._createdBy === user.userName)
  ) {
    return true
  } else {
    return false
  }
}

export const isAllowToPin = (pin: IMapPin, user?: IUser) => {
  if (hasAdminRights(user) || (pin._id && user && pin._id === user.userName)) {
    return true
  } else {
    return false
  }
}

// ensure docs passed to edit check contain _createdBy field
export interface IEditableDoc extends DBDoc {
  _createdBy: string
}

// Convert theme em string to px number
export const emStringToPx = (width) => Number(width.replace('em', '')) * 16

export const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)
