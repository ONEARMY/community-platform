import { ISelectedTags } from './tags.model'
import { IDbDoc } from './common.models'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { IUploadedFileMeta } from 'src/stores/storage'

// By default all how-to form input fields come as strings
// The IHowto interface can imposes the correct formats on fields
// Additionally convert from local filemeta to uploaded filemeta
export interface IHowto extends IHowtoFormInput, IDbDoc {
  cover_image: IUploadedFileMeta
  files: IUploadedFileMeta[]
  steps: IHowtoStep[]
}

export interface IHowtoStep extends IHowToStepFormInput {
  // *** NOTE - adding an '_animationKey' field to track when specific array element removed for
  images: IUploadedFileMeta[]
  title: string
  text: string
  caption?: string
  _animationKey?: string
}

export interface IHowToStepFormInput {
  images: IUploadedFileMeta[] | IConvertedFileMeta[]
  title: string
  text: string
  caption?: string
  _animationKey?: string
}

export interface IHowtoFormInput {
  // NOTE cover image input starts as convertedFileMeta but is transformed on upload
  cover_image: IUploadedFileMeta | IConvertedFileMeta[]
  title: string
  description: string
  difficulty_level: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
  time: string
  files: IUploadedFileMeta[] | File[]
  steps: IHowToStepFormInput[]
  slug: string
  // note, tags will remain optional as if populated {} will be stripped by db (firestore)
  tags?: ISelectedTags
  caption?: string
}
