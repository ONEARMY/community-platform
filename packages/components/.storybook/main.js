const path = require('path')
const paths = {
  appSrcDir: path.resolve(__dirname, '../../../'),
}

module.exports = {
  stories: [
    '../../../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../components/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  features: {
    emotionAlias: false,
  },
  // https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app
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
  ],
  // https://storybook.js.org/docs/react/configure/typescript
  typescript: {},
  // update path resolution so root folder correctly checked for direct 'src' imports (before other folders)
  // https://webpack.js.org/configuration/resolve/#resolve-modules
  // https://storybook.js.org/docs/react/configure/webpack
  webpackFinal: async (config) => {
    config.resolve.modules = [
      paths.appSrcDir,
      ...(config.resolve.modules || []),
    ]
    return config
  },
}
