import { ISelectedTags } from './tags.model'
import { IFirebaseUploadInfo } from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploader'

// By default all tutorial form input fields come as strings
// The IHowto interface imposes the correct formats on fields
// adds additional populated meta fields, and forces cover image
export interface IHowto extends IHowtoFormInput {
  tutorial_cost: number
  cover_image: IFirebaseUploadInfo
  _created: Date
  _modified: Date
}

export interface IHowtoStep {
  // *** NOTE legacy format only tracked urls - this will be removed once data upgraded
  images: IFirebaseUploadInfo[]
  title: string
  text: string
}

export interface IHowtoFormInput {
  workspace_name: string
  cover_image: IFirebaseUploadInfo | null
  // *** NOTE legacy format only tracked urls - this will be removed once data upgraded
  cover_image_url?: string
  tutorial_title: string
  tutorial_description: string
  difficulty_level: 'easy' | 'medium' | 'difficult'
  tutorial_time: string
  tutorial_cost: any
  tutorial_extern_file_url: string
  tutorial_files: IFirebaseUploadInfo[]
  steps: IHowtoStep[]
  id: string
  slug: string
  tags: ISelectedTags
}
