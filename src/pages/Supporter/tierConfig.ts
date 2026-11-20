export type TierConfigEntry = { color: string; name: string; description: string };

export const TIER_CONFIG: Record<number, TierConfigEntry> = {
  1: {
    color: '#BFDEBA',
    name: 'Start',
    description: 'You help us develop new features, get videos in 4K without ads!',
  },
  2: {
    color: '#77BDE3',
    name: 'Power',
    description: 'You help us develop new features, get videos in 4K without ads!',
  },
  3: {
    color: '#FEE77B',
    name: 'Boost',
    description: 'You help us develop new features, get videos in 4K without ads!',
  },
};
