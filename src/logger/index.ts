import Logger from 'pino'
import { createPinoBrowserSend, createWriteStream } from 'pino-logflare'
import { getConfigurationOption } from '../config/config'

const logLevel = getConfigurationOption('REACT_APP_LOG_LEVEL', 'info')

let loggerInstance: Logger.Logger
if (getConfigurationOption('REACT_APP_LOGFLARE_KEY', '')) {
  const logflareConfiguration = {
    apiKey: getConfigurationOption('REACT_APP_LOGFLARE_KEY', ''),
    sourceToken: getConfigurationOption('REACT_APP_LOGFLARE_SOURCE', ''),
  }

  loggerInstance = Logger(
    {
      browser: {
        transmit: {
          send: createPinoBrowserSend(logflareConfiguration),
        },
      },
      level: logLevel,
    },
    createWriteStream(logflareConfiguration),
  )
} else {
  loggerInstance = Logger({
    browser: { asObject: false },
    level: logLevel,
  })
}

export const logger = loggerInstance
