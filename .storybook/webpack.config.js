const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        //include: path.resolve(__dirname, '../src'),
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [['react-app', { flow: false, typescript: true }]],
            },
          },
          {
            loader: require.resolve('react-docgen-typescript-loader'),
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
}
