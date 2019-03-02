import { firestore } from 'firebase/app'

// remove special characters from string, also replacing spaces with dashes
const stripSpecialCharacters = (text: string) => {
  return text
    .replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '')
    .split(' ')
    .join('-')
}

// take an array of objects and convert to an single object, using a unique key
// that already exists in the array element, i.e.
// [{id:'abc',val:'hello'},{id:'def',val:'world'}] = > {abc:{id:abc,val:'hello}, def:{id:'def',val:'world'}}
const arrayToJson = (arr: any[], keyField: string) => {
  const json = {}
  arr.forEach(el => {
    if (el.hasOwnProperty(keyField)) {
      const key = el[keyField]
      json[key] = el
    }
  })
  return json
}

export function toTimestamp(dateString: string) {
  return firestore.Timestamp.fromDate(new Date(dateString))
}

export default { stripSpecialCharacters, arrayToJson }
