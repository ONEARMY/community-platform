import countries from 'react-flags-select/lib/countries.js'
import { IHowto } from 'src/models/howto.models'
import { IUser } from 'src/models/user.models'
import { DBDoc } from 'src/models/common.models'

// remove special characters from string, also replacing spaces with dashes
export const stripSpecialCharacters = (text?: string) => {
  return text
    ? text
        .replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .split(' ')
        .join('-')
    : ''
}

// take an array of objects and convert to an single object, using a unique key
// that already exists in the array element, i.e.
// [{id:'abc',val:'hello'},{id:'def',val:'world'}] = > {abc:{id:abc,val:'hello}, def:{id:'def',val:'world'}}
export const arrayToJson = (arr: any[], keyField: string) => {
  const json = {}
  arr.forEach(el => {
    if (el.hasOwnProperty(keyField)) {
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

/************************************************************************
 *              Date Methods
 ***********************************************************************/
export const timestampToYear = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.getFullYear()
}

export const getMonth = (d: Date) => {
  // use ECMAScript Internationalization API to return month
  return `${d.toLocaleString('en-us', { month: 'long' })}`
}
export const getDay = (d: Date) => {
  return `${d.getDate()}`
}

/************************************************************************
 *             Validators
 ***********************************************************************/
export const isEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export const isAllowToEditContent = (doc: IEditableDoc, user: IUser) => {
  if (
    (user.userRoles && user.userRoles.includes('super-admin')) ||
    (doc._createdBy && doc._createdBy === user.userName)
  ) {
    return true
  } else {
    return false
  }
}

/************************************************************************
 *             Country code to country name converters
 ***********************************************************************/
export const getCountryCode = (countryName: string | undefined) => {
  return Object.keys(countries).find(key => countries[key] === countryName)
}

export const getCountryName = (countryCode: string | undefined) => {
  if (countries.hasOwnProperty(countryCode)) {
    return countries[countryCode]
  } else {
    return countryCode
  }
}

// ensure docs passed to edit check contain _createdBy field
interface IEditableDoc extends DBDoc {
  _createdBy: string
}
