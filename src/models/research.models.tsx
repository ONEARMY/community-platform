import { DBDoc, ISelectedTags } from 'src/models'
import { IUploadedFileMeta } from 'src/stores/storage'

/** All typings related to the Research Module can be found here */
export namespace IResearch {
  /** The main research item, as created by a user */
  export interface Item {
    title: string
    description: string
    /** This should be a url-safe version of the title */
    slug: string
    updates: Update[]
    tags: ISelectedTags
    _createdBy: string
  }

  /** A research item update */
  export interface Update {
    title: string
    description: string
    files: Array<IUploadedFileMeta | File | null>
  }

  /** Research items synced from the database will contain additional metadata */
  // Use of Omit to override the 'updates' type to UpdateDB
  export type ItemDB = Omit<Item, 'updates'> & { updates: UpdateDB[] } & DBDoc

  export type UpdateDB = Update & DBDoc
}
