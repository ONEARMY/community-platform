import { Icon } from 'oa-components'
import { impactQuestions } from 'src/pages/UserSettings/content/formSections/Impact/impactQuestions'

import type { availableGlyphs } from 'oa-components'
import type { IImpactDataField } from 'src/models'

interface Props {
  id: IImpactDataField['id']
}

export const ImpactIcon = ({ id }: Props) => {
  const question = impactQuestions.find((question) => question.id === id)

  if (!question || !question.icon) return null

  const glyph = question.icon as availableGlyphs

  return <Icon glyph={glyph} />
}
