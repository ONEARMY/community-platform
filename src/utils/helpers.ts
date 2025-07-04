import { isObservableObject, toJS } from 'mobx'
import { IModerationStatus, UserRole } from 'oa-shared'
import { getConfigurationOption, NO_MESSAGING } from 'src/config/config'
import { DEFAULT_PUBLIC_CONTACT_PREFERENCE } from 'src/pages/UserSettings/constants'

import { SUPPORTED_IMAGE_TYPES } from './storage'

import type { DBDoc, DBProfile, IMapPin, IModerable, IUser } from 'oa-shared'

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
export const capitalizeFirstLetter = (str: string) => {
  if (!str || typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

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

  return roles.includes(UserRole.ADMIN)
}

export const hasAdminRightsSupabase = (user?: DBProfile) => {
  if (!user) {
    return false
  }

  const roles = user.roles && Array.isArray(user.roles) ? user.roles : []

  return roles.includes(UserRole.ADMIN)
}

export const needsModeration = (doc: IModerable, user?: IUser) => {
  if (!hasAdminRights(user)) {
    return false
  }
  return doc.moderation !== IModerationStatus.ACCEPTED
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

export const isMessagingBlocked = () => {
  return NO_MESSAGING === 'true'
}

export const isUserContactable = (user: IUser) => {
  return isContactable(user.isContactableByPublic)
}

export const isContactable = (preference: boolean | undefined) => {
  if (isMessagingBlocked()) {
    return false
  }

  return typeof preference === 'boolean'
    ? preference
    : DEFAULT_PUBLIC_CONTACT_PREFERENCE
}

export const getProjectEmail = (subject: string) => {
  const site = getConfigurationOption('VITE_THEME', 'precious-plastic')
  return `mailto:platform@onearmy.earth?subject=${subject}%20${site}`
}

// ensure docs passed to edit check contain _createdBy field
export interface IEditableDoc extends DBDoc {
  _createdBy: string
}

export const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const buildStatisticsLabel = ({
  stat,
  statUnit,
  usePlural,
}: {
  stat: number | undefined
  statUnit: string
  usePlural: boolean
}): string => {
  if (stat === 1 || !usePlural) {
    return `${stat} ${statUnit}`
  }

  return `${typeof stat === 'number' ? stat : 0} ${statUnit}s`
}

export function validateImage(image: File | null) {
  const error =
    image?.type && !SUPPORTED_IMAGE_TYPES.includes(image.type)
      ? new Error(`Unsupported image extension: ${image.type}`)
      : null
  const valid: boolean = !error

  return { valid, error }
}

export function validateImages(images: File[]) {
  const errors: Error[] = []
  for (const image of images) {
    const { error } = validateImage(image)
    if (error) {
      errors.push(error)
    }
    continue
  }

  return { valid: errors.length === 0, errors }
}
