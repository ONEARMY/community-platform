import * as _ from 'lodash'
import { ISelectedTags } from 'src/models/tags.model'

// Functions used to give as callback to the isEqual prop of a form fields.
// The isEqual callback is used to determine if a field is dirty.
export const COMPARISONS = {
  textInput: (a: string, b: string): boolean => {
    if (!a && !b) {
      return true
    }
    return a === b
  },
  tags: (a: ISelectedTags, b: ISelectedTags): boolean => {
    return _.isEqual(a, b)
  },
}
