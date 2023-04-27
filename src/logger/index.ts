import { toJS } from 'mobx'
import { LogflareHttpClient } from 'logflare-transport-core'
import { getConfigurationOption } from '../config/config'
import { Roarr } from 'roarr'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logLevel = getConfigurationOption('REACT_APP_LOG_LEVEL', 'info')

let loggerInstance: any
let writeFn: any

const USER_ID = window.crypto.randomUUID()

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

const LOGFLARE_KEY = getConfigurationOption('REACT_APP_LOGFLARE_KEY', '')
const LOGFLARE_SOURCE = getConfigurationOption('REACT_APP_LOGFLARE_SOURCE', '')

if (LOGFLARE_KEY) {
  // eslint-disable-next-line no-console
  console.log({ LOGFLARE_KEY, LOGFLARE_SOURCE })
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
    // eslint-disable-next-line no-console
    console.log(JSON.parse(message))
  }
  loggerInstance = Roarr.child({})
}

globalThis.ROARR.write = writeFn

loggerInstance.info('Logger initialized')

export const logger = loggerInstance
