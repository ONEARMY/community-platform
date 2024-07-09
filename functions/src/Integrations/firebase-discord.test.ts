import { handleResearchUpdatePublished } from './firebase-discord'

describe('handleResearchUpdatePublished', () => {
  it('should send message when there is new update', () => {
    const change = {
      before: {
        data: () => {
          return {
            updates: [],
          }
        },
      },
      after: {
        data: () => {
          return {
            slug: 'test',
            updates: [
              {
                title: 'test',
                collaborators: ['bob'],
              },
            ],
          }
        },
      },
    } as any

    let wasMockSendMessagedCalled = false
    const mockSendMessage = (_: string): Promise<any> => {
      wasMockSendMessagedCalled = true
      return Promise.resolve()
    }

    handleResearchUpdatePublished('example.com', change, mockSendMessage)
    expect(wasMockSendMessagedCalled).toEqual(true)
  })

  it('should not send message when there is no new update', () => {
    const change = {
      before: {
        data: () => {
          return {
            slug: 'test',
            updates: [
              {
                title: 'test',
                collaborators: ['bob'],
              },
            ],
          }
        },
      },
      after: {
        data: () => {
          return {
            slug: 'test',
            updates: [
              {
                title: 'test',
                collaborators: ['bob'],
              },
            ],
          }
        },
      },
    } as any

    let wasMockSendMessagedCalled = false
    const mockSendMessage = (_: string): Promise<any> => {
      wasMockSendMessagedCalled = true
      return Promise.resolve()
    }

    handleResearchUpdatePublished('example.com', change, mockSendMessage)
    expect(wasMockSendMessagedCalled).toEqual(false)
  })
})
