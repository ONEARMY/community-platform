import * as _ from 'lodash'
import { ISelectedTags } from 'src/models/tags.model'

/** Functions used to give as callback to the isEqual prop of form fields.
 *  The isEqual callback is used to determine if a field is dirty.
 */
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
  image: (a, b): boolean => {
    // When there was no image and there still isn't one it's not dirty
    if (!a && !b) {
      return true
    }
    // when there was an image and it's no longer there or the other way around it's dirty
    if ((!a && b) || (!b && a)) {
      return false
    }
    // When a new image is selected the type is IConvertedFileMeta which has a
    // blob property.
    if ((a && a.blob) || (b && b.blob)) {
      return false
    }
    // When the image didn't change it's not dirty
    return a.fullPath === b.fullPath && a.size === b.size
  },
  step: (a, b): boolean => {
    if (!a && !b) {
      return true
    }
    if (!a || !b) {
      return false
    }
    // Only check the number of steps because the individual components of a step will
    // also mark the form as dirty
    return a.length === b.length
  },
}
