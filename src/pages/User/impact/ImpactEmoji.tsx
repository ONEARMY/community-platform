import type { IImpactDataField } from 'src/models'
import { impactQuestions } from 'src/pages/UserSettings/content/formSections/Impact/impactQuestions'

interface Props {
  id: IImpactDataField['id']
}

export const ImpactEmoji = ({ id }: Props) => {
  const question = impactQuestions.find((question) => question.id === id)

  if (!question || !question.emoji) return null

  return (
    <div
      dangerouslySetInnerHTML={{ __html: question.emoji }}
      style={{ display: 'inline' }}
    />
  )
}
