const wp = require('@cypress/webpack-preprocessor')

const options = {
  webpackOptions: {
    mode: 'development',
    // make sure the source maps work
    devtool: 'eval-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      ],
    },
  },
}

module.exports = wp(options)
