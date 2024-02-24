import { isObservableObject, toJS } from 'mobx'
import {
  IModerationStatus,
  ResearchStatus,
  ResearchUpdateStatus,
  UserRole,
} from 'oa-shared'
import { DEFAULT_PUBLIC_CONTACT_PREFERENCE } from 'src/pages/UserSettings/constants'

import type { DBDoc, IModerable, IResearch } from 'src/models'
import type { IMapPin } from 'src/models/maps.models'
import type { IUser } from 'src/models/user.models'
import type {
  AuthorOption,
  IItem,
} from 'src/stores/common/FilterSorterDecorator/FilterSorterDecorator'

const specialCharactersPattern = /[^a-zA-Z0-9_-]/gi

// remove special characters from string, also replacing spaces with dashes
export const stripSpecialCharacters = (text: string) => {
  return text
    ? text.split(' ').join('-').replace(specialCharactersPattern, '')
    : ''
}

// get special characters from string using the same pattern as stripSpecialCharacters
export const getSpecialCharacters = (text: string): string[] =>
  Array.from(text.matchAll(specialCharactersPattern)).map((x) => x[0])

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

export const numberWithCommas = (number: number) => {
  return new Intl.NumberFormat('en-US').format(number)
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
    const isItemAccepted = item.moderation === IModerationStatus.ACCEPTED
    const wasCreatedByUser = user && item._createdBy === user.userName
    const isAdminAndAccepted =
      hasAdminRights(user) &&
      item.moderation !== IModerationStatus.DRAFT &&
      item.moderation !== IModerationStatus.REJECTED

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

/**
 * Checks if the user has admin rights based on their roles.
 *
 * @param {IUser} [user] - The user for whom to check admin rights.
 * @returns {boolean}
 */
export const hasAdminRights = (user?: IUser) => {
  if (!user) {
    return false
  }
  if (isObservableObject(user)) {
    user = toJS(user)
  }

  const roles =
    user.userRoles && Array.isArray(user.userRoles) ? user.userRoles : []

  if (roles.includes(UserRole.ADMIN) || roles.includes(UserRole.SUPER_ADMIN)) {
    return true
  } else {
    return false
  }
}

export const needsModeration = (doc: IModerable, user?: IUser) => {
  if (!hasAdminRights(user)) {
    return false
  }
  return doc.moderation !== IModerationStatus.ACCEPTED
}

/**
 * Checks if the user is allowed to edit the content.
 *
 * @param {IEditableDoc & { collaborators?: string[] }} doc - The document to be edited.
 * @param {IUser} [user] - The user attempting to edit the document.
 *
 * @returns {boolean}
 */
export const isAllowedToEditContent = (
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

/**
 * Checks if the user is allowed to delete the content.
 *
 * @param {IEditableDoc} doc - The document to be deleted.
 * @param {IUser} [user] - The user attempting to delete the document.
 * @returns {boolean} True if the user is allowed to delete, false otherwise.
 */
export const isAllowedToDeleteContent = (doc: IEditableDoc, user?: IUser) => {
  if (!user) {
    return false
  }

  if (isObservableObject(user)) {
    user = toJS(user)
  }

  const roles =
    user.userRoles && Array.isArray(user.userRoles) ? user.userRoles : []

  return (
    roles.includes(UserRole.ADMIN) ||
    roles.includes(UserRole.SUPER_ADMIN) ||
    doc._createdBy! === user.userName
  )
}

export const isAllowedToPin = (pin: IMapPin, user?: IUser) => {
  if (hasAdminRights(user) || (pin._id && user && pin._id === user.userName)) {
    return true
  } else {
    return false
  }
}

export const isUserBlockedFromMessaging = (user: IUser | null | undefined) => {
  if (!user) {
    return null
  }
  return user.isBlockedFromMessaging
}

export const isUserContactable = (user: IUser) => {
  return isContactable(user.isContactableByPublic)
}

export const isContactable = (preference: boolean | undefined) => {
  return typeof preference === 'boolean'
    ? preference
    : DEFAULT_PUBLIC_CONTACT_PREFERENCE
}

export const calculateTotalUpdateComments = (
  item: IResearch.ItemDB | IItem,
): number => {
  if (item.updates) {
    const commentOnUpdates = item.updates.reduce((totalComments, update) => {
      const updateCommentsLength =
        !update._deleted &&
        update.status !== ResearchUpdateStatus.DRAFT &&
        update.comments
          ? update.comments.length
          : 0
      return totalComments + updateCommentsLength
    }, 0)

    return commentOnUpdates ? commentOnUpdates : 0
  } else {
    return 0
  }
}

export const getPublicUpdates = (item: IResearch.ItemDB) => {
  if (item.updates) {
    return item.updates.filter(
      (update) =>
        update.status !== ResearchUpdateStatus.DRAFT && !update._deleted,
    )
  } else {
    return []
  }
}

// ensure docs passed to edit check contain _createdBy field
export interface IEditableDoc extends DBDoc {
  _createdBy: string
}

export const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const getAuthorOptions = (items: IItem[]): AuthorOption[] => {
  if (!items?.length) return []

  return Array.from(
    new Set<string>(
      items.flatMap((item: IItem) => [
        item._createdBy,
        ...(item.collaborators || []),
      ]),
    ),
  )
    .filter(Boolean)
    .sort()
    .map((author) => ({
      label: author,
      value: author,
    }))
}

export const buildStatisticsLabel = ({
  stat,
  statUnit,
  usePlural,
}: {
  stat: number
  statUnit: string
  usePlural: boolean
}): string => {
  if (stat === 1 || !usePlural) {
    return `${stat} ${statUnit}`
  }

  return `${stat || 0} ${statUnit}s`
}

export const researchStatusColour = (
  researchStatus: ResearchStatus,
): string => {
  return researchStatus === ResearchStatus.ARCHIVED
    ? 'lightgrey'
    : researchStatus === ResearchStatus.COMPLETED
    ? 'betaGreen'
    : 'accent.base'
}
