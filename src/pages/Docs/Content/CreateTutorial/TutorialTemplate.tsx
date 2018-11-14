import { ITutorialFormInput } from 'src/models/tutorial.models'

export const TUTORIAL_TEMPLATE_DATA: ITutorialFormInput = {
  tutorial_description: '',
  tutorial_title: '',
  tutorial_time: '',
  tutorial_cost: '',
  difficulty_level: 'easy',
  cover_image_url: '',
  tutorial_extern_file_url: '',
  tutorial_files: [],
  id: '',
  slug: '',
  steps: [
    {
      title: '',
      text: '',
      images: [],
    },
    {
      title: '',
      text: '',
      images: [],
    },
    {
      title: '',
      text: '',
      images: [],
    },
  ],
  tags: {},
  workspace_name: '',
}
