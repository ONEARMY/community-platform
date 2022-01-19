import Logger from 'pino'
import { getConfigirationOption } from 'src/config/config';

const logLevel = getConfigirationOption('REACT_APP_LOG_LEVEL', 'warn');

export const logger = Logger({ browser: { asObject: false }, level: logLevel })
