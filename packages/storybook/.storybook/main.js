const path = require('path')
const paths = {
  appSrcDir: path.resolve(__dirname, '../../../'),
}

module.exports = {
  stories: ['../../../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  // https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-knobs',
    'storybook/preset-create-react-app',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
  // https://storybook.js.org/docs/react/configure/typescript
  typescript: {},
  // update path resolution so root folder correctly checked for direct 'src' imports (before other folders)
  // https://webpack.js.org/configuration/resolve/#resolve-modules
  // https://storybook.js.org/docs/react/configure/webpack
  webpackFinal: async config => {
    config.resolve.modules = [paths.appSrcDir, ...(config.resolve.modules || [])]
    return config
  },
}
