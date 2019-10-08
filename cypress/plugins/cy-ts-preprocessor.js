const wp = require('@cypress/webpack-preprocessor')

const options = {
  webpackOptions: {
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: { transpileOnly: true }
        }
      ]
    }
  },
}

module.exports = wp(options)
