import { configure, addParameters } from '@storybook/react'
import { create } from '@storybook/theming'

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'One Army UI Kit',
      brandUrl: 'https://onearmy.world',
    }),
    isFullscreen: false,
    panelPosition: 'bottom',
  },
})

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.(js|jsx|mdx)$/), module)
