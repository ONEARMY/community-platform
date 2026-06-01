export type TierConfigEntry = { color: string; name: string; description: string };

export const TIER_CONFIG: Record<number, TierConfigEntry> = {
  1: {
    color: '#BFDEBA',
    name: 'Starter',
    description: 'You help us develop new features, get videos in 4K without adds!',
  },
  2: {
    color: '#77BDE3',
    name: 'Hero',
    description: 'You help us develop new features, get videos in 4K without adds!',
  },
  3: {
    color: '#FEE77B',
    name: 'Legend',
    description: 'You help us develop new features, get videos in 4K without adds!',
  },
};
