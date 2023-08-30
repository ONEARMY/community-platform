import type { IUploadedFileMeta } from '../stores/storage'
import type { IConvertedFileMeta } from '../types'
import type { IComment } from './'
import type { ICategory } from './categories.model'
import type {
  DBDoc,
  IModerable,
  ISharedFeatures,
  UserMention,
} from './common.models'
import type { ISelectedTags } from './tags.model'

// By default all how-to form input fields come as strings
// The IHowto interface can imposes the correct formats on fields
// Additionally convert from local filemeta to uploaded filemeta
export interface IHowto extends IHowtoFormInput {
  _createdBy: string
  _deleted: boolean
  cover_image?: IUploadedFileMeta
  fileLink?: string
  // Comments were added in V2, old howto's may not have the property
  comments?: IComment[]
  total_downloads?: number
  mentions: UserMention[]
  previousSlugs: string[]
}

/**
 * Howtos retrieved from the database also include metadata such as _id, _created and _modified
 */
export type IHowtoDB = IHowto & DBDoc

export interface IHowtoStep extends IHowToStepFormInput {
  // *** NOTE - adding an '_animationKey' field to track when specific array element removed for
  images?: Array<IUploadedFileMeta | null>
  videoUrl?: string
  title?: string
  text?: string
  _animationKey?: string
}

export interface IHowToStepFormInput {
  images?: Array<IUploadedFileMeta | IConvertedFileMeta | null>
  title?: string
  text?: string
  videoUrl?: string
  _animationKey?: string
}

export interface IHowtoFormInput extends IModerable, ISharedFeatures {
  slug: string
  title: string
  allowDraftSave?: boolean
  category?: ICategory
  // NOTE cover image input starts as convertedFileMeta but is transformed on upload
  cover_image?: IUploadedFileMeta | IConvertedFileMeta
  // Added to be able to recover on edit by admin
  creatorCountry?: string
  description?: string
  difficulty_level?: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
  files?: Array<IUploadedFileMeta | File | null>
  fileLink?: string
  mentions?: UserMention[]
  steps: IHowToStepFormInput[]
  // note, tags will remain optional as if populated {} will be stripped by db (firestore)
  tags?: ISelectedTags
  time?: string
}
