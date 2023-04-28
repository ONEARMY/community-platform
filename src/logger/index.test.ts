import { faker } from '@faker-js/faker'
import { LogflareHttpClient } from 'logflare-transport-core'
import { getLogger } from './index'

jest.mock('logflare-transport-core')

describe('logger', () => {
  beforeEach(() => {
    ;(LogflareHttpClient as any).mockClear()
  })

  it('should log formatted message to console by default', () => {
    const mockConsole = {
      log: jest.fn(),
    }
    const logger = getLogger(
      {
        LOGFLARE_KEY: '',
        LOGFLARE_SOURCE: '',
      },
      mockConsole,
      'debug',
    )
    logger.error('test')
    expect(mockConsole.log.mock.calls[1]).toEqual([
      '%c[error]',
      'color: orangered',
      'test',
    ])

    logger.warn('test')
    expect(mockConsole.log.mock.calls[2]).toEqual([
      '%c[warn]',
      'color: gold',
      'test',
    ])

    logger.info('test')
    expect(mockConsole.log.mock.calls[3]).toEqual([
      '%c[info]',
      'color: paleturquoise',
      'test',
    ])

    logger.debug({ key: 'value' }, 'test')
    expect(mockConsole.log.mock.calls[4]).toEqual(
      expect.arrayContaining([
        '%c[debug]',
        'color: aquamarine',
        'test',
        { key: 'value' },
      ]),
    )
  })

  it('validates filtering for each log level', () => {
    const mockConsole = { log: jest.fn() }

    const logger = getLogger({} as any, mockConsole, 'warn')

    logger.debug('test')

    expect(mockConsole.log).not.toHaveBeenCalled()
  })

  describe('logflare', () => {
    it('writes to external service', () => {
      const mockConsole = {
        log: jest.fn(),
      }
      const logger = getLogger(
        {
          LOGFLARE_KEY: 'test',
          LOGFLARE_SOURCE: 'test',
        },
        mockConsole,
        'debug',
      )
      const msg = faker.lorem.sentence()

      // Act
      logger.error(msg)

      // Assert
      expect(mockConsole.log).not.toHaveBeenCalled()

      expect(
        (LogflareHttpClient as any).mock.instances[0].addLogEvent.mock
          .calls[1][0].message,
      ).toBe(msg)
    })

    it('validates consistent id for each sesssion', () => {
      const mockConsole = { log: jest.fn() }

      const logger = getLogger(
        {
          LOGFLARE_KEY: 'test',
          LOGFLARE_SOURCE: 'test',
        },
        mockConsole,
        'debug',
      )

      logger.debug('test')
      logger.debug('test2')

      expect(
        (LogflareHttpClient as any).mock.instances[0].addLogEvent.mock
          .calls[2][0].metadata.browserSessionId,
      ).toBe(
        (LogflareHttpClient as any).mock.instances[0].addLogEvent.mock
          .calls[1][0].metadata.browserSessionId,
      )
    })

    it('provides well structured logs for logflare', () => {
      const mockConsole = {
        log: jest.fn(),
      }
      const logger = getLogger(
        {
          LOGFLARE_KEY: 'test',
          LOGFLARE_SOURCE: 'test',
        },
        mockConsole,
        'debug',
      )
      const msg = faker.lorem.sentence()

      // Act
      logger.error(msg)

      // Assert
      expect(
        (LogflareHttpClient as any).mock.instances[0].addLogEvent.mock
          .calls[1][0].metadata,
      ).toEqual(
        expect.objectContaining({
          browserSessionId: expect.any(String),
          level: expect.any(String),
        }),
      )
    })
  })
})
