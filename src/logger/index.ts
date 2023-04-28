import { toJS } from 'mobx'
import { LogflareHttpClient } from 'logflare-transport-core'
import { getConfigurationOption } from '../config/config'
import { Roarr, type Logger, logLevels } from 'roarr'
import { v4 as uuidv4 } from 'uuid'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logLevel = getConfigurationOption('REACT_APP_LOG_LEVEL', 'info')

let loggerInstance: Logger

const USER_ID = uuidv4()

const roarrToLogFlareMapper = (msg) => {
  const { message, logLevel, ...rest } = msg
  return {
    message,
    metadata: {
      browserSessionId: USER_ID,
      level: getLevelLabelFromNumber(logLevel),
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

const logLevelColourMap = {
  trace: 'black',
  debug: 'aquamarine',
  info: 'paleturquoise',
  warn: 'gold',
  error: 'orangered',
}

export const getLogger = (
  logFlareConfiguration: {
    LOGFLARE_KEY: string
    LOGFLARE_SOURCE: string
  },
  injectedConsole,
  minLogLevel: 'warn' | 'info' | 'debug' | 'trace' | 'error' | 'fatal' = 'info',
) => {
  const { LOGFLARE_KEY, LOGFLARE_SOURCE } = logFlareConfiguration
  if (LOGFLARE_KEY && LOGFLARE_SOURCE) {
    const client = new LogflareHttpClient({
      apiKey: LOGFLARE_KEY,
      sourceToken: LOGFLARE_SOURCE,
    })

    loggerInstance = Roarr.child<{ error: Error }>((msg) => {
      const message = toJS(msg)
      return {
        ...message,
        level: message.context.logLevel,
        context: {
          env: getConfigurationOption('REACT_APP_SITE_VARIANT', 'local'),
          ...toJS(message.context),
          ...(message.context.error && {
            error: {
              message: message.context.error.message,
            },
          }),
        },
      }
    })
    globalThis.ROARR.write = (message) => {
      client.addLogEvent(roarrToLogFlareMapper(JSON.parse(message)))
    }
    loggerInstance.debug('Logflare logging initialized')
  } else {
    loggerInstance = Roarr.child({})
    globalThis.ROARR.write = (message) => {
      const msg = JSON.parse(message)
      const { logLevel, ...cleanedContext } = msg.context
      const logLevelLabel = getLevelLabelFromNumber(logLevel)

      // eslint-disable-next-line no-console
      if (logLevel >= logLevels[minLogLevel]) {
        injectedConsole.log(
          ...[
            `%c[${logLevelLabel}]`,
            `color: ${logLevelColourMap[logLevelLabel]}`,
            msg.message,
            isEmpty(cleanedContext) ? undefined : cleanedContext,
          ].filter(Boolean),
        )
      }
    }
    loggerInstance.debug('Console logging initialized')
  }

  return loggerInstance
}

const isEmpty = (empty) =>
  Object.keys(empty).length === 0 && empty.constructor === Object

export const logger = getLogger(
  {
    LOGFLARE_KEY: getConfigurationOption('REACT_APP_LOGFLARE_KEY', ''),
    LOGFLARE_SOURCE: getConfigurationOption('REACT_APP_LOGFLARE_SOURCE', ''),
  },
  console,
  getConfigurationOption('REACT_APP_LOG_LEVEL', 'info') as
    | 'warn'
    | 'info'
    | 'debug'
    | 'trace'
    | 'error'
    | 'fatal',
)
