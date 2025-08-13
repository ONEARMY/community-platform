import type { DBProfileType } from '../../models/profileType'

export const profileTypes: Partial<DBProfileType>[] = [
  {
    name: 'member',
    display_name: 'Member',
    order: 0,
    image_url: '',
    description: '',
    map_pin_name: 'Member',
  },
  {
    name: 'machine-builder',
    display_name: 'Machine Builder',
    order: 2,
    image_url: '',
    description: '',
    map_pin_name: 'Machine Builder',
  },
  {
    name: 'workspace',
    display_name: 'Workspace',
    order: 1,
    image_url: '',
    description: '',
    map_pin_name: 'Workspace',
  },
]
