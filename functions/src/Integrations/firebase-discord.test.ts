import { ResearchUpdateStatus } from 'oa-shared/models/research'
import { handleResearchUpdatePublished } from './firebase-discord'

import type { SimpleResearchArticle } from './firebase-discord'

describe('handle research article update change', () => {
  it('should send message when there is new update', () => {
    const webhookUrl = 'exmaple.com'
    const previousContent: SimpleResearchArticle = {
      slug: 'test',
      updates: [],
    }
    const newContent: SimpleResearchArticle = {
      slug: 'test',
      updates: [
        {
          _id: 'bobtesting',
          title: 'test',
          collaborators: ['Bob'],
        },
      ],
    }

    let wasMockSendMessagedCalled = false
    const mockSendMessage = (_: string): Promise<any> => {
      wasMockSendMessagedCalled = true
      return Promise.resolve()
    }

    handleResearchUpdatePublished(
      webhookUrl,
      previousContent,
      newContent,
      mockSendMessage,
    )
    expect(wasMockSendMessagedCalled).toEqual(true)
  })

  it('should not send message when there is no new update', () => {
    const webhookUrl = 'exmaple.com'
    const previousContent: SimpleResearchArticle = {
      slug: 'test',
      updates: [
        {
          _id: 'bobmore',
          title: 'test',
          collaborators: ['Bob'],
        },
      ],
    }
    const newContent: SimpleResearchArticle = {
      slug: 'test',
      updates: [
        {
          _id: 'bobmore',
          title: 'test',
          collaborators: ['Bob'],
        },
      ],
    }

    let wasMockSendMessagedCalled = false
    const mockSendMessage = (_: string): Promise<any> => {
      wasMockSendMessagedCalled = true
      return Promise.resolve()
    }

    handleResearchUpdatePublished(
      webhookUrl,
      previousContent,
      newContent,
      mockSendMessage,
    )
    expect(wasMockSendMessagedCalled).toEqual(false)
  })

  it('should not send message when update is a draft', () => {
    const webhookUrl = 'exmaple.com'
    const previousContent: SimpleResearchArticle = {
      slug: 'test',
      updates: [],
    }
    const newContent: SimpleResearchArticle = {
      slug: 'test',
      updates: [
        {
          _id: 'bobmore',
          title: 'test',
          collaborators: ['Bob'],
          status: ResearchUpdateStatus.DRAFT,
        },
      ],
    }

    let wasMockSendMessagedCalled = false
    const mockSendMessage = (_: string): Promise<any> => {
      wasMockSendMessagedCalled = true
      return Promise.resolve()
    }

    handleResearchUpdatePublished(
      webhookUrl,
      previousContent,
      newContent,
      mockSendMessage,
    )
    expect(wasMockSendMessagedCalled).toEqual(false)
  })
})
