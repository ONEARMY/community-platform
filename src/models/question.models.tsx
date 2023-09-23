import type { DBDoc, IModerable, ISharedFeatures } from '.'

/**
 * Research retrieved from the database also include metadata such as _id, _created and _modified
 */
export type IQuestionDB = DBDoc & IQuestion.Item

/** All typings related to the Research Module can be found here */
type UserIdList = string[]

export namespace IQuestion {
  /** The main research item, as created by a user */
  export type Item = {
    _createdBy: string
    _deleted: boolean
    subscribers?: UserIdList
  } & Omit<FormInput, 'collaborators'> &
    ISharedFeatures

  export interface FormInput extends IModerable {
    title: string
    description: string
    slug: string
    previousSlugs?: string[]
  }
}
