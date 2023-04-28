import { faker } from '@faker-js/faker'
import { LogflareHttpClient } from 'logflare-transport-core'
import { getLogger } from './index'

jest.mock('logflare-transport-core')

describe('logger', () => {
  beforeEach(() => {
    ;(LogflareHttpClient as any).mockClear()
  })

  it('should log to console by default', () => {
    const mockConsole = {
      log: jest.fn(),
    }
    const logger = getLogger(
      {
        LOGFLARE_KEY: '',
        LOGFLARE_SOURCE: '',
      },
      mockConsole,
    )
    logger.error('test')
    expect(mockConsole.log.mock.calls[1]).toEqual(
      expect.arrayContaining(['%c[error]', 'color: red', 'test']),
    )
  })

  it.todo('validates formatting for each log level')
  it.todo('validates filtering for each log level')
  it.todo('validates unique id for each sesssion')
  it.todo('provides well structured logs for logflare')

  it.skip('should log to logflare if configured', () => {
    const mockConsole = {
      log: jest.fn(),
    }
    const logger = getLogger(
      {
        LOGFLARE_KEY: 'test',
        LOGFLARE_SOURCE: 'test',
      },
      mockConsole,
    )
    const msg = faker.lorem.sentence()

    // Act
    logger.error(msg)

    // Assert
    expect(mockConsole.log).not.toHaveBeenCalled()

    expect(
      (LogflareHttpClient as any).mock.instances[0].addLogEvent.mock.calls[1][0]
        .message,
    ).toBe(msg)
  })
})
