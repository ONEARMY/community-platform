import { IModerationStatus, ResearchUpdateStatus } from 'oa-shared'

import { handleResearchUpdatePublished } from './firebase-discord'

import type { IResearch } from 'oa-shared/models/research'

const factoryResearch = {
  _id: 'id',
  _contentModifiedTimestamp: '',
  _created: '',
  _createdBy: '',
  _modified: '',
  _deleted: false,
  collaborators: [],
  moderation: IModerationStatus.ACCEPTED,
  totalCommentCount: 0,
  slug: 'test',
  title: '',
  description: '',
  tags: {},
}

describe('handle research article update change', () => {
  it('should send message when there is new update', () => {
    const webhookUrl = 'exmaple.com'
    const previousContent = {
      ...factoryResearch,
      updates: [],
    }
    const newContent = {
      ...factoryResearch,
      updates: [
        {
          _id: 'bobtesting',
          title: 'test',
          status: 'published',
          collaborators: ['Bob'],
        } as IResearch.Update,
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
    const previousContent = {
      ...factoryResearch,
      updates: [
        {
          _id: 'bobmore',
          collaborators: ['Bob'],
          status: 'published',
          title: 'test',
        } as IResearch.Update,
      ],
    }
    const newContent = {
      ...factoryResearch,
      updates: [
        {
          _id: 'bobmore',
          collaborators: ['Bob'],
          status: 'published',
          title: 'test',
        } as IResearch.Update,
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
    const previousContent = {
      ...factoryResearch,
      updates: [],
    }
    const newContent = {
      ...factoryResearch,
      updates: [
        {
          _id: 'bobmore',
          title: 'test',
          collaborators: ['Bob'],
          status: ResearchUpdateStatus.DRAFT,
        } as IResearch.Update,
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
  it('should send message when last update changes from draft to published', () => {
    const webhookUrl = 'exmaple.com'
    const previousContent = {
      ...factoryResearch,
      updates: [
        {
          _id: 'bobmore',
          title: 'test',
          collaborators: ['Bob'],
          status: ResearchUpdateStatus.DRAFT,
        } as IResearch.Update,
      ],
    }
    const newContent = {
      ...factoryResearch,
      updates: [
        {
          _id: 'bobmore',
          title: 'test',
          collaborators: ['Bob'],
          status: ResearchUpdateStatus.PUBLISHED,
        } as IResearch.Update,
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
})
