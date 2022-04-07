import { addons } from '@storybook/addons'
import { create } from '@storybook/theming'

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  panelPosition: 'bottom',
  enableShortcuts: true,
  isToolshown: true,
  theme: create({
    base: 'light',
    brandTitle: 'One Army UI Kit',
    brandUrl: 'https://onearmy.world',
  }),
  selectedPanel: undefined,
  initialActive: 'sidebar',
  sidebar: {
    showRoots: false,
    collapsedRoots: ['other'],
  },
})

// automatically import all files ending in *.stories.js
// configure(require.context('../src', true, /\.stories\.(js|jsx|mdx)$/), module)
