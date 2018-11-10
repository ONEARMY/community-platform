import { ITag } from './tags.model'

export interface ITutorial {
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
  tags: ITag[]
}

export interface ITutorialStep {
  images: string[]
  title: string
  text: string
}
