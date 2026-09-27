export const SETTINGS_TABS = [
  { title: 'Profile', route: '/settings/profile' },
  { title: 'Map', route: '/settings/map' },
  { title: 'Impact', route: '/settings/impact' },
  { title: 'Notifications', route: '/settings/notifications' },
  { title: 'Account', route: '/settings/account' },
] as const;

export type SettingsRoute = (typeof SETTINGS_TABS)[number]['route'];
