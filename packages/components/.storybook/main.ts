import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const Config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx', '../src/stories.mdx'],

  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@react-theming/storybook-addon',
    '@storybook/addon-mdx-gfm',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: false,
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      publicDir: '../public',
    })
  },
}
export default Config
