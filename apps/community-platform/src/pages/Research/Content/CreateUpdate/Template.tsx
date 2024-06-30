import { ResearchUpdateStatus } from '@onearmy.apps/shared'

import type { IResearch } from '../../../../models/research.models'

const INITIAL_VALUES: Partial<IResearch.Update> = {
  title: '',
  description: '',
  images: [],
  status: ResearchUpdateStatus.PUBLISHED,
}

export default {
  INITIAL_VALUES,
}
