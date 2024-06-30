import { Icon } from '@onearmy.apps/components'

import { impactQuestions } from '../../../pages/UserSettings/content/formSections/Impact/impactQuestions'

import type { IImpactDataField } from '../../../models'

interface Props {
  id: IImpactDataField['id']
}

export const ImpactIcon = ({ id }: Props) => {
  const question = impactQuestions.find((question) => question.id === id)

  if (!question || !question.icon) return null

  const glyph = question.icon

  return <Icon glyph={glyph as any} />
}
