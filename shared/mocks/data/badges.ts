import type { DBProfileBadge } from '../../models/profileBadge';

export const badges: Partial<DBProfileBadge>[] = [
  {
    name: 'pro',
    display_name: 'PRO',
    image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/icons/pro.svg',
    action_url: 'https://www.preciousplastic.com/pro-membership',
    premium_tier: 1,
    available_to: 'space',
    action_label: 'Go PRO',
  },
];
