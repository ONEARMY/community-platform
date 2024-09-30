import { ResearchUpdateStatus } from 'oa-shared'

import type { IResearch } from 'oa-shared'

const INITIAL_VALUES: Partial<IResearch.Update> = {
  title: '',
  description: '',
  images: [],
  status: ResearchUpdateStatus.PUBLISHED,
}

export default {
  INITIAL_VALUES,
}
