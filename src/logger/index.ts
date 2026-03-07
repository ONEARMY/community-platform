import { Logger } from 'tslog';

const levelNumberToNameMap = {
  silly: 0,
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  fatal: 6,
};

export const logger = new Logger({
  type: 'pretty',
  minLevel: process.env.NODE_ENV === 'test' ? 999 : levelNumberToNameMap['info'],
  hideLogPositionForProduction: true,
});
