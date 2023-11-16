import type { ImpactDataField } from 'src/models'

interface Props {
  label: ImpactDataField['label']
}

const EMOJI_MAP = {
  'full time employees': '&#x1f46f',
  'machines built': '&#x2699;&#xfe0f;',
  'plastic recycled': '&#x1f52b',
  revenue: '&#x1f4b8',
  volunteers: '&#x1f3c5',
}

export const ImpactEmoji = ({ label }: Props) => {
  const emoji = EMOJI_MAP[label]

  if (!emoji) return null

  return (
    <div
      dangerouslySetInnerHTML={{ __html: emoji }}
      style={{ display: 'inline' }}
    />
  )
}
