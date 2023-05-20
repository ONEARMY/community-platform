import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
const Config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx', '../src/*.mdx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
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
