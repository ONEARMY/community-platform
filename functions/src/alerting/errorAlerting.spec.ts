import { EventContext } from 'firebase-functions/v1'
import * as ErrorAlerting from './errorAlerting'

jest
  .spyOn(ErrorAlerting, 'sendErrorAlert')
  .mockImplementation(() => Promise.resolve())

describe('withErrorAlerting', () => {
  it('Should run a function with params', () => {
    const fn = jest.fn()
    const params = ['test', 'test2']
    const context = {
      eventId: 'test',
    }
    ErrorAlerting.withErrorAlerting(context as EventContext, fn, params)
    expect(fn).toHaveBeenCalledWith(...params)
    expect(ErrorAlerting.sendErrorAlert).not.toHaveBeenCalled()
  })

  it('Should run a function without params', () => {
    const fn = jest.fn()
    const context = {
      eventId: 'test',
    }
    ErrorAlerting.withErrorAlerting(context as EventContext, fn)
    expect(fn).toHaveBeenCalled()
    expect(ErrorAlerting.sendErrorAlert).not.toHaveBeenCalled()
  })

  it('Should run a function catch an error', () => {
    const fn = jest.fn(() => {
      throw new Error('test')
    })
    const context = {
      eventId: 'test',
    }
    ErrorAlerting.withErrorAlerting(context as EventContext, fn)
    expect(fn).toThrow()
    expect(ErrorAlerting.sendErrorAlert).toHaveBeenCalled()
  })
})
