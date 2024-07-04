import { ResearchUpdateStatus } from '@onearmy.apps/shared'

import type { IResearchUpdate } from '../../../../models'

const INITIAL_VALUES: Partial<IResearchUpdate> = {
  title: '',
  description: '',
  images: [],
  status: ResearchUpdateStatus.PUBLISHED,
}

export default {
  INITIAL_VALUES,
}
