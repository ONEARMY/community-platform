export interface IImpactQuestion {
  id: string
  emoji: string
  description: string
  label: string
  isVisible: boolean
  value?: number
  suffix?: string
  prefix?: string
}

export const impactQuestions: IImpactQuestion[] = [
  {
    id: 'plastic',
    emoji: '&#x1f52b',
    description:
      'How many KGs of plastic recycled have you recycled in that year?',
    label: 'plastic recycled',
    suffix: 'Kg of',
    isVisible: true,
  },
  {
    id: 'revenue',
    emoji: '&#x1f4b8',
    description:
      'What was your revenue (in $)? By revenue we mean all money coming in.',
    label: 'revenue',
    prefix: '$',
    isVisible: true,
  },
  {
    id: 'employees',
    emoji: '&#x1f46f',
    description: 'How many people did your project employ (you included)?',
    label: 'full time employees',
    isVisible: true,
  },
  {
    id: 'volunteers',
    emoji: '&#x1f3c5',
    description: 'How many volunteers did you work with?',
    label: 'volunteers',
    isVisible: true,
  },
  {
    id: 'machines',
    emoji: '&#x2699;&#xfe0f;',
    description: 'How many machines did you build?',
    label: 'machines built',
    isVisible: true,
  },
]
