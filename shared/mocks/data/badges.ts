import type { DBProfileBadge } from '../../models/profileBadge'

export const badges: Partial<DBProfileBadge>[] = [
  {
    name: 'pro',
    display_name: 'PRO',
    image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/icons/pro.svg',
    action_url: '',
  },
  {
    name: 'supporter',
    display_name: 'Supporter',
    image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/icons/supporter.svg',
    action_url: '',
  },
]
