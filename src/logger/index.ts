import Logger from 'pino'
import { createPinoBrowserSend, createWriteStream } from 'pino-logflare'
import { getConfigirationOption } from 'src/config/config'

const logLevel = getConfigirationOption('REACT_APP_LOG_LEVEL', 'info')

let loggerInstance

if (getConfigirationOption('REACT_APP_LOGFLARE_KEY', '')) {
  const logflareConfiguration = {
    apiKey: getConfigirationOption('REACT_APP_LOGFLARE_KEY', ''),
    sourceToken: getConfigirationOption('REACT_APP_LOGFLARE_SOURCE', ''),
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
  loggerInstance = Logger({ browser: { asObject: false }, level: logLevel })
}

export const logger = loggerInstance
