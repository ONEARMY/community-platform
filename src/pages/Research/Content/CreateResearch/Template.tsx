import { IResearch } from 'src/models/research.models'

const INITIAL_VALUES: Partial<IResearch.FormInput> = {
  tags: {},
  title: '',
  description: '',
}

export default {
  INITIAL_VALUES,
}
