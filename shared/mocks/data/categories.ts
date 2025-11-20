import type { DBCategory } from '../../models';

export const categories: Partial<DBCategory>[] = [
  {
    name: 'Machines',
    type: 'projects',
  },
  {
    name: 'Moulds',
    type: 'projects',
  },
  {
    name: 'Guides',
    type: 'projects',
  },
  {
    name: 'Other',
    type: 'projects',
  },
  // Add for other content types and update specs!
];
