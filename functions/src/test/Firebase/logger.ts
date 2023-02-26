import { logger } from 'firebase-functions/v1'

/**
 * Utility method to spy on all firebase logger methods
 * @example
 * ```
 * const mockLogger = FirebaseLoggerSpy
 * // run test that logs results
 * await runSomeTest()
 * // inspect what was sent to the logger
 * expect(mockLogger.info).toBeCalledTimes(1)
 * expect(mockLogger.info).toBeCalledWith('This was the log')
 * ```
 * */
export const FirebaseLoggerSpy: Record<keyof typeof logger, jest.SpyInstance> =
  {
    debug: jest.spyOn(logger, 'debug'),
    error: jest.spyOn(logger, 'error'),
    info: jest.spyOn(logger, 'info'),
    log: jest.spyOn(logger, 'log'),
    warn: jest.spyOn(logger, 'warn'),
    write: jest.spyOn(logger, 'warn'),
  }
