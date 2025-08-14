import type { DBProfileType } from '../../models/profileType'

export const profileTypes: Partial<DBProfileType>[] = [
  {
    name: 'member',
    display_name: 'Member',
    is_space: false,
    description: '',
    image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/profile-types/pp-member.svg',
    map_pin_name: '',
    order: 1,
    small_image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/profile-types/map-member.svg',
  },
  {
    name: 'machine-builder',
    display_name: 'Machine Builder',
    order: 3,
    description: '',
    map_pin_name: 'Machine Builder',
    is_space: true,
    image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/profile-types/pp-machine.svg',
    small_image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/profile-types/pp-machine-small.svg',
  },
  {
    name: 'workspace',
    display_name: 'Workspace',
    order: 2,
    description: '',
    map_pin_name: 'Workspace',
    is_space: true,
    image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/profile-types/pp-workspace.svg',
    small_image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/profile-types/pp-workspace-small.svg',
  },
  {
    name: 'community-point',
    display_name: 'Community Point',
    order: 4,
    description: '',
    map_pin_name: 'Community Point',
    is_space: true,
    image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/profile-types/pp-community.svg',
    small_image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/profile-types/pp-community-small.svg',
  },
  {
    name: 'collection-point',
    display_name: 'Collection Point',
    order: 5,
    description: '',
    map_pin_name: 'Collection Point',
    is_space: true,
    image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/profile-types/pp-collection.svg',
    small_image_url:
      'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/one-army/profile-types/pp-collection-small.svg',
  },
]
