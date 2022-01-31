import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { DBDoc, IModerable, ISelectedTags } from 'src/models'
import { IUploadedFileMeta } from 'src/stores/storage'


// By default all how-to form input fields come as strings
// The IResearch interface can imposes the correct formats on fields
// Additionally convert from local filemeta to uploaded filemeta
export interface IResearch extends IModerable {
  _createdBy: string
  cover_image: IUploadedFileMeta
  files: Array<IUploadedFileMeta | File | null>  
}

/**
 * Research retrieved from the database also include metadata such as _id, _created and _modified
 */
export type IResearchDB = IResearch & DBDoc

export type IResearchStats = {
  votedUsefulCount: number
}

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
  }

  export interface FormInput extends IModerable {
    title: string
    description: string
    slug: string
    tags: ISelectedTags
  }

  /** Research items synced from the database will contain additional metadata */
  // Use of Omit to override the 'updates' type to UpdateDB
  export type ItemDB = Omit<Item, 'updates'> & { updates: UpdateDB[] } & DBDoc

  export type UpdateDB = Update & DBDoc
}
