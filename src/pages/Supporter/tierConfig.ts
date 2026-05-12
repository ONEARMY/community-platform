export const TIER_CONFIG: Record<
  number,
  {
    color: string;
    name: string;
    description: string;
  }
> = {
  1: {
    color: 'green',
    name: 'starter',
    description: 'You help the ecosystem become more sustainable.',
  },
  2: {
    color: 'blue',
    name: 'core',
    description: 'You help us develop new features.',
  },
  3: {
    color: '#F5C207',
    name: 'impact',
    description: 'You enable open source solutions to thrive and reach more people.',
  },
};
