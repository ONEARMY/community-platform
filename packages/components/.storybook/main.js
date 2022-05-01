const path = require('path')
const paths = {
  appSrcDir: path.resolve(__dirname, '../../../'),
}
const webpack = require('webpack')

module.exports = {
  stories: [
    '../../../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../components/src/**/*.story.@(js|jsx|ts|tsx|mdx)',
    '../src/**/*.story.@(js|jsx|ts|tsx|mdx)',
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

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /AuthWrapper\/AuthWrapper/,
        (resource) => {
          resource.request = path.resolve(
            __dirname,
            '../src/__mocks__/AuthWrapper.mock.tsx',
          )
          return resource
        },
      ),
    )

    return config
  },
}
