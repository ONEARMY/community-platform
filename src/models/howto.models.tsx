import { ISelectedTags } from './tags.model'
import { IDbDoc } from './common.models'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { IUploadedFileMeta } from 'src/stores/storage'

// By default all tutorial form input fields come as strings
// The IHowto interface can imposes the correct formats on fields
// adds additional populated meta fields, and forces cover image
export interface IHowto extends IHowtoFormInput, IDbDoc {
  cover_image: IUploadedFileMeta
}

export interface IHowtoStep {
  // *** NOTE legacy format only tracked urls - this will be removed once data upgraded
  // *** NOTE 2 - adding an '_animationKey' field to track when specific array element removed for
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
  tutorial_files: IUploadedFileMeta[]
  steps: IHowtoStep[]
  slug: string
  tags: ISelectedTags
}
