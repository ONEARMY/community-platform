import { IHowtoFormInput } from 'src/models/howto.models'

export const TUTORIAL_TEMPLATE_DATA: IHowtoFormInput = {
  tutorial_description: '',
  tutorial_title: '',
  tutorial_time: '',
  tutorial_cost: null,
  difficulty_level: 'easy',
  cover_image: null,
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
