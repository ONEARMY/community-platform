import { addDecorator, addParameters, configure } from '@storybook/react'
import themeDecorator from './theme-decorator'
import { create } from '@storybook/theming'

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'One Army UI Kit',
      brandUrl: 'https://onearmy.world',
      // To control appearance:
      // brandImage: 'http://url.of/some.svg',
    }),
    isFullscreen: false,
    panelPosition: 'right',
  },
})
//

addDecorator(themeDecorator)

// automatically import all files ending in *.stories.tsx
const req = require.context('../src', true, /.stories.tsx$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
