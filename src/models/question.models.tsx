import type { DBDoc, IModerable, ISharedFeatures } from '.'

/**
 * Question retrieved from the database also include metadata such as _id, _created and _modified
 */
export type IQuestionDB = DBDoc & IQuestion.Item

/** All typings related to the Question Module can be found here */
type UserIdList = string[]

export namespace IQuestion {
  /** The main Question item, as created by a user */
  export type Item = {
    _created: string
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
