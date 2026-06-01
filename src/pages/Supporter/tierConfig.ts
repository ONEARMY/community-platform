export type TierConfigEntry = { color: string; name: string; description: string };

export const TIER_CONFIG: Record<number, TierConfigEntry> = {
  1: {
    color: '#BFDEBA',
    name: 'starter',
    description: 'You help us develop new features, get videos in 4K without adds!',
  },
  2: {
    color: '#77BDE380',
    name: 'hero',
    description: 'You help us develop new features, get videos in 4K without adds!',
  },
  3: {
    color: '#FEE77B80',
    name: 'legend',
    description: 'You help us develop new features, get videos in 4K without adds!',
  },
};
