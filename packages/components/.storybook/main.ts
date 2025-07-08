import { dirname, join } from 'path'
import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
const Config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx', '../src/*.mdx'],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      publicDir: '../public',
    })
  },
}
export default Config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
