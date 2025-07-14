import { NotificationDisplay } from 'oa-shared'
import { describe, expect, it } from 'vitest'

import { FactoryComment } from '../factories/Comment'
import { FactoryNewsItem } from '../factories/News'
import { FactoryQuestionItem } from '../factories/Question'
import {
  FactoryResearchItem,
  FactoryResearchItemUpdate,
} from '../factories/ResearchItem'
import {
  factorySupabaseNotification,
  factoryTriggeredBy,
} from '../factories/supabaseNotification'

describe('NotificationDisplay', () => {
  describe('fromNotification', () => {
    describe('setEmailBody', () => {
      it('includes parent content title and description for research updates', () => {
        const notification = factorySupabaseNotification({
          contentType: 'researchUpdate',
          parentContent: FactoryResearchItemUpdate({
            title: 'New breakthrough',
            description: 'We worked it out.',
          }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.body).toContain('New breakthrough:')
        expect(result.email.body).toContain('We worked it out.')
      })

      it('returns undefined for non-research update notifications', () => {
        const commentNotification = factorySupabaseNotification({
          contentType: 'comment',
          content: FactoryComment(),
        })

        const result = NotificationDisplay.fromNotification(commentNotification)

        expect(result.email.body).toBeUndefined()
      })
    })

    describe('setEmailButtonLabel', () => {
      it('returns "Join the discussion" for research updates', () => {
        const notification = factorySupabaseNotification({
          contentType: 'researchUpdate',
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.buttonLabel).toBe('Join the discussion')
      })

      it('returns "See the full discussion" for comments', () => {
        const notification = factorySupabaseNotification({
          contentType: 'comment',
          content: FactoryComment(),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.buttonLabel).toBe('See the full discussion')
      })

      it('returns "See the full discussion" for replies', () => {
        const notification = factorySupabaseNotification({
          contentType: 'reply',
          content: FactoryComment(),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.buttonLabel).toBe('See the full discussion')
      })

      it('returns "View now" for unknown content types', () => {
        const notification = factorySupabaseNotification({
          contentType: 'unknownType' as any,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.buttonLabel).toBe('View now')
      })
    })

    describe('setEmailPreview', () => {
      it('includes parent title for research updates', () => {
        const notification = factorySupabaseNotification({
          contentType: 'researchUpdate',
          sourceContent: FactoryResearchItem({ title: 'Source Title' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.preview).toBe('New research update on Source Title')
      })

      it('includes username for comments when triggeredBy exists', () => {
        const notification = factorySupabaseNotification({
          contentType: 'comment',
          triggeredBy: factoryTriggeredBy({ username: 'JeffB' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.preview).toBe('JeffB has left a new comment')
      })

      it('returns generic message for comments without triggeredBy', () => {
        const notification = factorySupabaseNotification({
          contentType: 'comment',
          triggeredBy: undefined,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.preview).toBe('A new comment notification')
      })

      it('includes username for replies when triggeredBy exists', () => {
        const notification = factorySupabaseNotification({
          contentType: 'reply',
          triggeredBy: factoryTriggeredBy({ username: 'Mario' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.preview).toBe('Mario has left a new reply')
      })

      it('returns generic message for replies without triggeredBy', () => {
        const notification = factorySupabaseNotification({
          contentType: 'reply',
          triggeredBy: undefined,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.preview).toBe('A new reply notification')
      })

      it('returns default message for unknown content types', () => {
        const notification = factorySupabaseNotification({
          contentType: 'unknownType' as any,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.preview).toBe('A new notification')
      })
    })

    describe('setEmailSubject', () => {
      it('includes parent title for research updates', () => {
        const notification = factorySupabaseNotification({
          contentType: 'researchUpdate',
          sourceContent: FactoryResearchItem({ title: 'Big Research Topic' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.subject).toBe('New update on Big Research Topic')
      })

      it('includes parent title for comments', () => {
        const notification = factorySupabaseNotification({
          contentType: 'comment',
          sourceContent: FactoryNewsItem({ title: 'Important news day' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.subject).toBe('A new comment on Important news day')
      })

      it('includes parent title for replies', () => {
        const notification = factorySupabaseNotification({
          contentType: 'reply',
          sourceContent: FactoryNewsItem({
            title: 'Still an important news day',
          }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.subject).toBe(
          'A new reply on Still an important news day',
        )
      })

      it('returns default subject for unknown content types', () => {
        const notification = factorySupabaseNotification({
          contentType: 'unknownType' as any,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.email.subject).toBe('A new notification')
      })
    })

    describe('setBody', () => {
      it('returns parent content title for research updates', () => {
        const notification = factorySupabaseNotification({
          contentType: 'researchUpdate',
          parentContent: FactoryResearchItemUpdate({ title: 'All going fine' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.body).toBe('All going fine')
      })

      it('returns comment text for comments', () => {
        const notification = factorySupabaseNotification({
          contentType: 'comment',
          content: FactoryComment({ comment: 'SO interesting' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.body).toBe('SO interesting')
      })

      it('returns comment text for replies', () => {
        const notification = factorySupabaseNotification({
          contentType: 'reply',
          content: FactoryComment({ comment: 'Useful comment, thank you' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.body).toBe('Useful comment, thank you')
      })

      it('returns empty string for unknown content types', () => {
        const notification = factorySupabaseNotification({
          contentType: 'unknownType' as any,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.body).toBe('')
      })
    })

    describe('setDate', () => {
      it('uses modifiedAt when available', () => {
        const modifiedDate = new Date('2024-06-15')
        const notification = factorySupabaseNotification({
          createdAt: new Date('2024-01-01'),
          modifiedAt: modifiedDate,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.date).toEqual(modifiedDate)
      })

      it('falls back to createdAt when modifiedAt is null', () => {
        const createdDate = new Date('2024-01-01')
        const notification = factorySupabaseNotification({
          createdAt: createdDate,
          modifiedAt: null,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.date).toEqual(createdDate)
      })
    })

    describe('setSidebarImage', () => {
      it('returns image when triggeredBy exists', () => {
        const notification = factorySupabaseNotification({
          triggeredBy: factoryTriggeredBy({ photoUrl: 'awsBucketPath' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.sidebar.image).toBe('awsBucketPath')
      })

      it('returns empty string when triggeredBy is undefined', () => {
        const notification = factorySupabaseNotification({
          triggeredBy: undefined,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.sidebar.image).toBe('')
      })
    })

    describe('setParentTitle', () => {
      it('uses source content title when available', () => {
        const notification = factorySupabaseNotification({
          sourceContent: FactoryQuestionItem({ title: 'Source Title' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.title.parentTitle).toBe('Source Title')
      })

      it('uses source content title when available', () => {
        const notification = factorySupabaseNotification({
          contentType: 'comment',
          sourceContent: FactoryResearchItem({
            title: 'The most important research',
          }),
          parentContent: FactoryResearchItemUpdate({ title: 'Big Update' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.title.parentTitle).toBe(
          'The most important research: Big Update',
        )
      })

      it('returns value even without source content', () => {
        const notification = factorySupabaseNotification({
          sourceContent: undefined,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.title.parentTitle).toEqual('')
      })
    })

    describe('setParentMiddle', () => {
      it('returns publishing label when a researchUpdate', () => {
        const notification = factorySupabaseNotification({
          contentType: 'researchUpdate',
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.title.middle).toBe('published a new update')
      })

      it('returns comment label when a comment', () => {
        const notification = factorySupabaseNotification({
          contentType: 'comment',
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.title.middle).toContain('comment')
      })

      it('returns reply label when a reply', () => {
        const notification = factorySupabaseNotification({
          contentType: 'reply',
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.title.middle).toContain('reply')
      })
    })

    describe('setParentSlug', () => {
      it('generates slug from source content', () => {
        const notification = factorySupabaseNotification({
          sourceContentType: 'questions',
          sourceContent: FactoryQuestionItem({ slug: 'source-item-slug' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.title.parentSlug).toEqual('questions/source-item-slug')
      })

      it('generates extra update information when research', () => {
        const notification = factorySupabaseNotification({
          sourceContentType: 'research',
          sourceContent: FactoryResearchItem({ slug: 'cool-topic' }),
          parentContentId: 888,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.title.parentSlug).toContain('#update_888')
      })
    })

    describe('setSlug', () => {
      it('generates base slug for researchUpdate', () => {
        const notification = factorySupabaseNotification({
          contentType: 'researchUpdate',
          sourceContent: FactoryResearchItem({
            slug: 'experimenting',
          }),
          parentContent: FactoryResearchItemUpdate({ id: 42 }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.slug).toBe('research/experimenting#update_42')
      })

      it('generates base slug for discussions', () => {
        const notification = factorySupabaseNotification({
          contentType: 'comment',
          sourceContentType: 'news',
          sourceContent: FactoryNewsItem({
            slug: 'event-details',
          }),
          content: FactoryComment({ id: 98 }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.slug).toBe('news/event-details#comment:98')
      })

      it('generates base slug for research discussions', () => {
        const notification = factorySupabaseNotification({
          contentType: 'comment',
          sourceContentType: 'research',
          sourceContent: FactoryResearchItem({
            slug: 'experimenting',
          }),
          parentContentId: 616,
          content: FactoryComment({ id: 101 }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.slug).toBe(
          'research/experimenting?update_616#comment:101',
        )
      })
    })

    describe('title.triggeredBy', () => {
      it('sets username when triggeredBy exists', () => {
        const notification = factorySupabaseNotification({
          triggeredBy: factoryTriggeredBy({ username: 'clark' }),
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.title.triggeredBy).toBe('clark')
      })

      it('sets empty string when triggeredBy is undefined', () => {
        const notification = factorySupabaseNotification({
          triggeredBy: undefined,
        })

        const result = NotificationDisplay.fromNotification(notification)

        expect(result.title.triggeredBy).toBe('')
      })
    })
  })
})
