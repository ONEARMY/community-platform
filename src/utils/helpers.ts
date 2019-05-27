import { firestore } from 'firebase/app'

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

/************************************************************************
 *              Date Methods
 ***********************************************************************/
export const toTimestamp = (dateString: string | Date) => {
  return firestore.Timestamp.fromDate(new Date(dateString))
}

// as firestore automatically populates timestamps from dates, want method to convert back
// and allow workign with Date objects (a bit hacky, but required for current firebase integration)
export const toDate = (d: firestore.Timestamp | Date) => {
  return d instanceof Date ? d : d.toDate()
}

/************************************************************************
 *             Validators
 ***********************************************************************/
export const isEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
