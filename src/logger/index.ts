import { toJS } from 'mobx'
import { LogflareHttpClient } from 'logflare-transport-core'
import { getConfigurationOption } from '../config/config'
import { Roarr, type Logger } from 'roarr'
import { v4 as uuidv4 } from 'uuid'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logLevel = getConfigurationOption('REACT_APP_LOG_LEVEL', 'info')

let loggerInstance: Logger
let writeFn: any

const USER_ID = uuidv4()

const roarrToLogFlareMapper = (msg) => {
  const { message, level, ...rest } = msg
  return {
    message,
    metadata: {
      user_id: USER_ID,
      level,
      ...rest,
    },
  }
}

const getLevelLabelFromNumber = (level) => {
  switch (level) {
    case 10:
      return 'trace'
    case 20:
      return 'debug'
    case 30:
      return 'info'
    case 40:
      return 'warn'
    case 50:
      return 'error'
    case 60:
      return 'fatal'
    default:
      return 'info'
  }
}

export const getLogger = (
  logFlareConfiguration: {
    LOGFLARE_KEY: string
    LOGFLARE_SOURCE: string
  },
  console,
) => {
  const { LOGFLARE_KEY, LOGFLARE_SOURCE } = logFlareConfiguration
  if (LOGFLARE_KEY && LOGFLARE_SOURCE) {
    const client = new LogflareHttpClient({
      apiKey: LOGFLARE_KEY,
      sourceToken: LOGFLARE_SOURCE,
    })

    writeFn = (message) => {
      client.addLogEvent(roarrToLogFlareMapper(JSON.parse(message)))
    }

    loggerInstance = Roarr.child<{ error: Error }>((msg) => {
      const message = toJS(msg)
      return {
        ...message,
        level: message.context.logLevel,
        context: {
          env: 'local',
          ...toJS(message.context),
          ...(message.context.error && {
            error: {
              message: message.context.error.message,
            },
          }),
        },
      }
    })
  } else {
    writeFn = (message) => {
      const msg = JSON.parse(message)
      const logLevel = getLevelLabelFromNumber(msg.context.logLevel)
      // eslint-disable-next-line no-console
      console.log(
        `%c[${logLevel}]`,
        `color: ${logLevel === 'error' ? 'red' : 'black'}`,
        msg.message,
      )
    }
    loggerInstance = Roarr.child({})
  }

  globalThis.ROARR.write = writeFn

  loggerInstance.info('Logger initialized')

  return loggerInstance
}

export const logger = getLogger(
  {
    LOGFLARE_KEY: getConfigurationOption('REACT_APP_LOGFLARE_KEY', ''),
    LOGFLARE_SOURCE: getConfigurationOption('REACT_APP_LOGFLARE_SOURCE', ''),
  },
  console,
)
