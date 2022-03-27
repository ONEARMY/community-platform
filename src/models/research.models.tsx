import type { IConvertedFileMeta } from 'src/types'
import { DBDoc, IComment, IModerable, ISelectedTags } from 'src/models'
import { IUploadedFileMeta } from 'src/stores/storage'

/** All typings related to the Research Module can be found here */
export namespace IResearch {
  /** The main research item, as created by a user */
  export interface Item extends FormInput {
    updates: Update[]
    _createdBy: string
  }

  /** A research item update */
  export interface Update {
    title: string
    description: string
    images: Array<IUploadedFileMeta | IConvertedFileMeta | null>
    videoUrl?: string
    comments?: IComment[]
  }

  export interface FormInput extends IModerable {
    title: string
    description: string
    slug: string
    tags: ISelectedTags
    creatorCountry?: string
  }

  /** Research items synced from the database will contain additional metadata */
  // Use of Omit to override the 'updates' type to UpdateDB
  export type ItemDB = Omit<Item, 'updates'> & { updates: UpdateDB[] } & DBDoc

  export type UpdateDB = Update & DBDoc
}
