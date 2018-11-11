import { ISelectedTags } from './tags.model'

// By default all tutorial form input fields come as strings
// The ITutorial interface imposes the correct formats on fields
export interface ITutorial extends ITutorialFormInput {
  tutorial_cost: number
}

export interface ITutorialStep {
  images: string[]
  title: string
  text: string
}

export interface ITutorialFormInput {
  workspace_name: string
  cover_image_url: string
  tutorial_title: string
  tutorial_description: string
  difficulty_level: 'easy' | 'medium' | 'difficult'
  tutorial_time: string
  tutorial_cost: number | string
  tutorial_extern_file_url: string
  tutorial_files_url: string
  steps: ITutorialStep[]
  id: string
  slug: string
  tags: ISelectedTags
}
