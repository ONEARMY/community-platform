import type { DBTag } from '../../models/tag';

export const tags: Partial<DBTag>[] = [
  {
    created_at: new Date().toISOString(),
    name: 'product',
  },
  {
    created_at: new Date().toISOString(),
    name: 'exhibition',
  },
  {
    created_at: new Date().toISOString(),
    name: 'howto_testing',
  },
  {
    created_at: new Date().toISOString(),
    name: 'brainstorm',
  },
  {
    created_at: new Date().toISOString(),
    name: 'compression',
  },
  {
    created_at: new Date().toISOString(),
    name: 'mould',
  },
  {
    created_at: new Date().toISOString(),
    name: 'injection',
  },
  {
    created_at: new Date().toISOString(),
    name: 'workshop',
  },
  {
    created_at: new Date().toISOString(),
    name: 'extrusion',
  },
  {
    created_at: new Date().toISOString(),
    name: 'screening',
  },
];
