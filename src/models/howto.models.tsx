import { ISelectedTags } from './tags.model'
import { DBDoc, IModerable } from './common.models'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { IUploadedFileMeta } from 'src/stores/storage'

// By default all how-to form input fields come as strings
// The IHowto interface can imposes the correct formats on fields
// Additionally convert from local filemeta to uploaded filemeta
export interface IHowto extends IHowtoFormInput, IModerable {
  _createdBy: string
  cover_image: IUploadedFileMeta
  files: Array<IUploadedFileMeta | File | null>
  steps: IHowtoStep[]
}
/**
 * Howtos retrieved from the database also include metadata such as _id, _created and _modified
 */
export type IHowtoDB = IHowto & DBDoc

export interface IHowtoStep extends IHowToStepFormInput {
  // *** NOTE - adding an '_animationKey' field to track when specific array element removed for
  images: Array<IUploadedFileMeta | null>
  title: string
  text: string
  _animationKey?: string
}

export interface IHowToStepFormInput {
  images: Array<IUploadedFileMeta | IConvertedFileMeta | null>
  title: string
  text: string
  _animationKey?: string
}

export interface IHowtoFormInput extends IModerable {
  // NOTE cover image input starts as convertedFileMeta but is transformed on upload
  cover_image: IUploadedFileMeta | IConvertedFileMeta
  title: string
  description: string
  difficulty_level: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
  time: string
  files: Array<IUploadedFileMeta | File | null>
  steps: IHowToStepFormInput[]
  slug: string
  // note, tags will remain optional as if populated {} will be stripped by db (firestore)
  tags?: ISelectedTags
}
