export interface IImpactQuestion {
  id: string;
  icon: string;
  description: string;
  label: string;
  value?: number;
  suffix?: string;
  prefix?: string;
}

export const impactQuestions: IImpactQuestion[] = [
  {
    id: 'plastic',
    icon: 'plastic',
    description: ' How many KGs of plastic have you recycled?',
    label: 'plastic recycled',
    suffix: 'Kg of',
  },
  {
    id: 'revenue',
    icon: 'revenue',
    description: 'What was your annual revenue (in USD)?',
    label: 'revenue',
    prefix: 'USD',
  },
  {
    id: 'employees',
    icon: 'employee',
    description: 'How many people did you employ (you included)?',
    label: 'full time employees',
  },
  {
    id: 'volunteers',
    icon: 'volunteer',
    description: 'How many volunteers did you work with?',
    label: 'volunteers',
  },
  {
    id: 'machines',
    icon: 'machine',
    description: 'How many machines did you build?',
    label: 'machines built',
  },
];
