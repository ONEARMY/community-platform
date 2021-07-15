/**
 * Building Functions
 *
 * The backend functions have various reference to code both in the main platform and shared folders
 * As this is not supported well by firebase functions (see issue below), webpack is used to
 * compile the full bundle, with code from shared folders included.
 *
 * As the main platform code needs to be compiled in a custom way (e.g. so 'src/' is recognised),
 * this is compiled to output typings to a lib folder before webpack is run.
 * Webpack accesses these files through it's own node_modules installation which has a symlink
 * to the rest of the platform code
 *
 * Useful Refs:
 * https://stackoverflow.com/questions/55783984/firebase-functions-with-yarn-workspaces
 * (open issue) https://github.com/firebase/firebase-tools/issues/653
 * https://jackywu.ca/2021/2021-01-02/
 * https://stackoverflow.com/questions/52487112/sharing-code-between-projects-using-typescript-and-webpack
 *
 */

import path from 'path'
import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'

import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import GenerateJsonPlugin from 'generate-json-webpack-plugin'

import PackageJson from './package.json'

const config: webpack.Configuration = {
  target: 'node',
  mode: 'production',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.json',
        },
        exclude: /node_modules/,
        include: [
          __dirname,
          // Include any external modules here
          // Note - yarn workspaces are bundled with node_modules so do not need to be included
          // path.resolve(__dirname, '../shared/'),
        ],
      },
    ],
  },
  plugins: [
    // Copy package json for upload
    // new CopyPlugin({
    //   patterns: [{ from: 'package.dist.json', to: 'package.json' }],
    // }),
    // clear dist folder
    new CleanWebpackPlugin(),
    // copy package.json
    new GenerateJsonPlugin('package.json', generatePackageJson(), null, 2),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  devtool: 'inline-source-map',
  externals: [
    // reference other installed workspace packages here
    nodeExternals({
      allowlist: [/^oa-/],
    }),
  ],
}
export default config

/**
 * When uploading firebase functions we need to include a package.json that does not
 * reference any of our workspace dependencies
 * (firebase installs node_modules on server, instead of uploading)
 *
 * Take the existing package.json and create a minimal copy without workspace entries
 */
function generatePackageJson() {
  const json = PackageJson
  const workspacePrefixes = ['oa-', 'one-army', 'onearmy', '@oa', '@onearmy']
  // TODO - could generate actual workspace list from `yarn workspace list --json`
  // remove workspace dependencies
  Object.keys(json.dependencies).forEach(key => {
    if (workspacePrefixes.find(prefix => key.startsWith(prefix))) {
      delete json.dependencies[key]
    }
  })
  // remove dev and other non-essential fields
  delete json.devDependencies
  delete json.resolutions
  delete json.scripts
  return json
}
