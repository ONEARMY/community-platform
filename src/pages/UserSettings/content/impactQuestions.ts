export interface IImpactQuestion {
  id: string
  icon: string
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
    icon: 'plastic',
    description:
      'How many KGs of plastic recycled have you recycled in that year?',
    label: 'plastic recycled',
    suffix: 'Kg of',
    isVisible: true,
  },
  {
    id: 'revenue',
    icon: 'revenue',
    description:
      'What was your annual revenue (in USD)? By revenue we mean all money coming in.',
    label: 'revenue',
    prefix: 'USD',
    isVisible: true,
  },
  {
    id: 'employees',
    icon: 'employee',
    description: 'How many people did your project employ (you included)?',
    label: 'full time employees',
    isVisible: true,
  },
  {
    id: 'volunteers',
    icon: 'volunteer',
    description: 'How many volunteers did you work with?',
    label: 'volunteers',
    isVisible: true,
  },
  {
    id: 'machines',
    icon: 'machine',
    description: 'How many machines did you build?',
    label: 'machines built',
    isVisible: true,
  },
]
