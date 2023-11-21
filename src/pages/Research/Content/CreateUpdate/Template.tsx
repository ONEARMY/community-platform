import type { IResearch } from 'src/models/research.models'

const INITIAL_VALUES: Partial<IResearch.Update> = {
  title: '',
  description: '',
  images: [],
  status: 'published',
}

export default {
  INITIAL_VALUES,
}
