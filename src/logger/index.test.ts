import { faker } from '@faker-js/faker'
import { LogflareHttpClient } from 'logflare-transport-core'
import { getLogger } from './index'

jest.mock('logflare-transport-core')

describe('logger', () => {
  beforeEach(() => {
    LogflareHttpClient.mockClear()
  })

  it('should log to console by default', () => {
    delete process.env.REACT_APP_LOGFLARE_KEY
    delete process.env.REACT_APP_LOGFLARE_SOURCE

    const consoleSpy = jest.spyOn(console, 'log')
    const logger = getLogger()
    logger.error('test')
    expect(consoleSpy.mock.calls[1]).toEqual(
      expect.arrayContaining(['%c[error]', 'color: red', 'test']),
    )
  })

  it.todo('validates formatting for each log level')

  it('should log to logflare if configured', () => {
    process.env.REACT_APP_LOGFLARE_KEY = 'test'
    process.env.REACT_APP_LOGFLARE_SOURCE = 'test'
    const logger = getLogger()
    const consoleSpy = jest.spyOn(console, 'log')
    const msg = faker.lorem.sentence()

    // Act
    logger.error(msg)

    // Assert
    expect(consoleSpy).not.toHaveBeenCalled()

    expect(
      LogflareHttpClient.mock.instances[0].addLogEvent.mock.calls[1][0].message,
    ).toBe(msg)

    // Cleanup
    delete process.env.REACT_APP_LOGFLARE_KEY
    delete process.env.REACT_APP_LOGFLARE_SOURCE
  })
})
