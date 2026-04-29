import { DBEmailContentReach } from '../../models';

export const emailContentReach: Partial<DBEmailContentReach>[] = [
  {
    name: 'all',
    preferences_label: 'Keep me close',
    create_content_label: 'Regular post',
    default_option: false,
  },
  {
    name: 'important',
    preferences_label: 'Big updates only',
    create_content_label: 'Big update',
    default_option: true,
  },
  {
    name: 'none',
    preferences_label: 'No emails',
    create_content_label: 'Silent (no email)',
    default_option: false,
  },
];
