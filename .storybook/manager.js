import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  panelPosition: 'bottom',
  enableShortcuts: true,
  isToolshown: true,
  theme: create({
    base: 'light',
    brandTitle: 'Platform UI (shadcn/Base UI)',
    brandUrl: 'https://onearmy.earth',
  }),
  selectedPanel: undefined,
  initialActive: 'sidebar',
  sidebar: {
    showRoots: false,
    collapsedRoots: ['other'],
  },
});
