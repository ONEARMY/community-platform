import Logger from 'pino'

const logLevel = process.env.REACT_APP_LOG_LEVEL || 'warn'; 

export const logger = Logger({ browser: { asObject: false }, level: logLevel })
