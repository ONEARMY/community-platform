import { logger } from './index'

describe('logger', () => {
  it('should support all log level methods', () => {
    ;['debug', 'info', 'warn', 'error', 'fatal'].forEach((level) => {
      expect(typeof logger[level]).toBe('function')
    })
  })
})
