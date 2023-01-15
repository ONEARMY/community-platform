import Logger from 'pino'
// import { createPinoBrowserSend, createWriteStream } from 'pino-logflare'
import { getConfigurationOption } from 'src/config/config'

const logLevel = getConfigurationOption('REACT_APP_LOG_LEVEL', 'info')

/**
 * TODO - Unsupported in react-scripts v5 (webpack 5)
 * Will require eject/craco to add support for 'stream' polyfill
 * */

// let loggerInstance
// if (getConfigurationOption('REACT_APP_LOGFLARE_KEY', '')) {
//   const logflareConfiguration = {
//     apiKey: getConfigurationOption('REACT_APP_LOGFLARE_KEY', ''),
//     sourceToken: getConfigurationOption('REACT_APP_LOGFLARE_SOURCE', ''),
//   }

//   loggerInstance = Logger(
//     {
//       browser: {
//         transmit: {
//           send: createPinoBrowserSend(logflareConfiguration),
//         },
//       },
//       level: logLevel,
//     },
//     createWriteStream(logflareConfiguration),
//   )
// } else {
const loggerInstance = Logger({ browser: { asObject: false }, level: logLevel })
// }

export const logger = loggerInstance
