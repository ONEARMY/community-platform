import { ISelectedTags } from './tags.model'
import { IDbDoc } from './common.models'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { IUploadedFileMeta } from 'src/stores/storage'

// By default all tutorial form input fields come as strings
// The IHowto interface can imposes the correct formats on fields
// Additionally convert from local filemeta to uploaded filemeta
export interface IHowto extends IHowtoFormInput, IDbDoc {
  cover_image: IUploadedFileMeta
  tutorial_files: IUploadedFileMeta[]
  steps: IHowtoStep[]
}

export interface IHowtoStep extends IHowToStepFormInput {
  // *** NOTE - adding an '_animationKey' field to track when specific array element removed for
  images: IUploadedFileMeta[]
  title: string
  text: string
  _animationKey?: string
}

export interface IHowToStepFormInput {
  images: IUploadedFileMeta[] | IConvertedFileMeta[]
  title: string
  text: string
  _animationKey?: string
}

export interface IHowtoFormInput {
  workspace_name: string
  // NOTE cover image input starts as convertedFileMeta but is transformed on upload
  cover_image: IUploadedFileMeta | IConvertedFileMeta[]
  // NOTE legacy format only tracked urls - this will be removed once data upgraded
  cover_image_url?: string
  tutorial_title: string
  tutorial_description: string
  difficulty_level: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
  tutorial_time: string
  tutorial_cost: any
  tutorial_extern_file_url: string
  tutorial_files: IUploadedFileMeta[] | IConvertedFileMeta[]
  steps: IHowToStepFormInput[]
  slug: string
  tags: ISelectedTags
}
