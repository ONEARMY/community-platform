import type { WebpackConfigOverride } from '@craco/types'
import { DefinePlugin, ProvidePlugin } from 'webpack'
import type { RuleSetRule } from 'webpack'

/**
 * Craco is used to provide config overrides to the default webpack config that is called
 * from react-scripts.
 */
module.exports = {
  webpack: {
    configure: (webpackConfig: WebpackConfigOverride['webpackConfig']) => {
      // Add polyfills for node (mostly imports for pino-logflare)
      // https://github.com/facebook/create-react-app/issues/11756
      // https://stackoverflow.com/questions/68707553/uncaught-referenceerror-buffer-is-not-defined
      webpackConfig.resolve!.fallback = {
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      }
      // Fix missing calls to process (react only adds process.env, not top-level process)
      //   webpackConfig.resolve!.alias = {
      //     ...webpackConfig.resolve!.alias,
      //     process: 'process/browser',
      //   }
      webpackConfig.module!.rules = hackUpdateRulesToSupportCJS(
        webpackConfig.module!.rules as RuleSetRule[],
      )
      webpackConfig.plugins = [
        ...(webpackConfig.plugins as any[]),
        // Fix calls to process (pino-logflare and cypress calling db.ts outside of cra)
        // NOTE - react creates 'process.env' variable but does not assign anything to 'process'
        // https://github.com/facebook/create-react-app/issues/11951
        new DefinePlugin({
          process: {},
        }),
        new ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ]
      return webpackConfig
    },
  },
}

/**
 * Prepend a custom rule to support CJS files
 *
 * NOTE - should be resolved in future CRA release pending merge of
 * https://github.com/facebook/create-react-app/pull/12021
 */
const hackUpdateRulesToSupportCJS = (rules: RuleSetRule[]) => {
  return rules.map((rule) => {
    if (rule.oneOf instanceof Array) {
      rule.oneOf[rule.oneOf.length - 1].exclude = [
        /\.(js|mjs|jsx|cjs|ts|tsx)$/,
        /\.html$/,
        /\.json$/,
      ]
    }
    return rule
  })
}
