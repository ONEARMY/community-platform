import { NotificationDisplay } from 'oa-shared'
import { describe, expect, it } from 'vitest'

import { FactoryComment } from '../factories/Comment'
import { FactoryLibraryItem } from '../factories/Library'
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
    describe('when a new comment', () => {
      it('on news', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 101,
          contentType: 'comment',
          content: FactoryComment({ id: 101, comment: 'Great work' }),
          sourceContentType: 'news',
          sourceContent: FactoryNewsItem({
            title: 'New thing coming',
            slug: 'new-thing-coming',
          }),
          triggeredBy: {
            id: 1,
            username: 'daveO',
            photoUrl: '',
          },
        })

        const notificationDisplay =
          NotificationDisplay.fromNotification(notification)

        expect(notificationDisplay.slug).toBe(
          'news/new-thing-coming#comment:101',
        )
        expect(notificationDisplay.body).toBe('Great work')
        expect(notificationDisplay.title).toStrictEqual({
          triggeredBy: 'daveO',
          middle: 'left a comment',
          parentTitle: 'New thing coming',
          parentSlug: 'news/new-thing-coming',
        })
        expect(notificationDisplay.email).toStrictEqual({
          body: 'Great work',
          buttonLabel: 'See the full discussion',
          preview: 'daveO has left a new comment',
          subject: 'A new comment on New thing coming',
        })
      })

      it('on library', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 102,
          contentType: 'comment',
          content: FactoryComment({ id: 102, comment: 'Amazing' }),
          sourceContentType: 'projects',
          sourceContent: FactoryLibraryItem({
            title: 'Best Guide',
            slug: 'best-guide',
          }),
          triggeredBy: factoryTriggeredBy({
            username: 'JEFF123',
          }),
        })

        const notificationDisplay =
          NotificationDisplay.fromNotification(notification)

        expect(notificationDisplay.slug).toBe('library/best-guide#comment:102')
        expect(notificationDisplay.body).toBe('Amazing')
        expect(notificationDisplay.title).toStrictEqual({
          triggeredBy: 'JEFF123',
          middle: 'left a comment',
          parentTitle: 'Best Guide',
          parentSlug: 'library/best-guide',
        })
        expect(notificationDisplay.email).toStrictEqual({
          body: 'Amazing',
          buttonLabel: 'See the full discussion',
          preview: 'JEFF123 has left a new comment',
          subject: 'A new comment on Best Guide',
        })
      })

      it('on questions', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 103,
          contentType: 'comment',
          content: FactoryComment({ id: 103, comment: "I'm not sure." }),
          sourceContentType: 'questions',
          sourceContent: FactoryQuestionItem({
            title: 'Where to start?',
            slug: 'where-to-start',
          }),
          triggeredBy: factoryTriggeredBy({
            username: 'Ben',
          }),
        })

        const notificationDisplay =
          NotificationDisplay.fromNotification(notification)

        expect(notificationDisplay.slug).toBe(
          'questions/where-to-start#comment:103',
        )
        expect(notificationDisplay.body).toBe("I'm not sure.")
        expect(notificationDisplay.title).toStrictEqual({
          triggeredBy: 'Ben',
          middle: 'left a comment',
          parentTitle: 'Where to start?',
          parentSlug: 'questions/where-to-start',
        })
        expect(notificationDisplay.email).toStrictEqual({
          body: "I'm not sure.",
          buttonLabel: 'See the full discussion',
          preview: 'Ben has left a new comment',
          subject: 'A new comment on Where to start?',
        })
      })

      it('on research update', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 104,
          contentType: 'comment',
          content: FactoryComment({ id: 104, comment: "I'm not sure." }),
          sourceContentType: 'research',
          sourceContent: FactoryResearchItem({
            title: 'New Buildings',
            slug: 'new-buildings',
          }),
          parentContentId: 777,
          parentContent: FactoryResearchItemUpdate({
            id: 777,
            title: 'Digging',
          }),
          triggeredBy: factoryTriggeredBy({
            username: 'Mario',
          }),
        })

        const notificationDisplay =
          NotificationDisplay.fromNotification(notification)

        expect(notificationDisplay.slug).toBe(
          'research/new-buildings?update_777#comment:104',
        )
        expect(notificationDisplay.body).toBe("I'm not sure.")
        expect(notificationDisplay.title).toStrictEqual({
          triggeredBy: 'Mario',
          middle: 'left a comment',
          parentTitle: 'New Buildings: Digging',
          parentSlug: 'research/new-buildings#update_777',
        })
        expect(notificationDisplay.email).toStrictEqual({
          body: "I'm not sure.",
          buttonLabel: 'See the full discussion',
          preview: 'Mario has left a new comment',
          subject: 'A new comment on New Buildings: Digging',
        })
      })
    })

    describe('when a new reply', () => {
      it('on news', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 101,
          contentType: 'reply',
          content: FactoryComment({ id: 101, comment: 'Great work' }),
          sourceContentType: 'news',
          sourceContent: FactoryNewsItem({
            title: 'New thing coming',
            slug: 'new-thing-coming',
          }),
          triggeredBy: {
            id: 1,
            username: 'daveO',
            photoUrl: '',
          },
        })

        const notificationDisplay =
          NotificationDisplay.fromNotification(notification)

        expect(notificationDisplay.slug).toBe(
          'news/new-thing-coming#comment:101',
        )
        expect(notificationDisplay.body).toBe('Great work')
        expect(notificationDisplay.title).toStrictEqual({
          triggeredBy: 'daveO',
          middle: 'left a reply',
          parentTitle: 'New thing coming',
          parentSlug: 'news/new-thing-coming',
        })
        expect(notificationDisplay.email).toStrictEqual({
          body: 'Great work',
          buttonLabel: 'See the full discussion',
          preview: 'daveO has left a new reply',
          subject: 'A new reply on New thing coming',
        })
      })

      it('on library', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 102,
          contentType: 'reply',
          content: FactoryComment({ id: 102, comment: 'Amazing' }),
          sourceContentType: 'projects',
          sourceContent: FactoryLibraryItem({
            title: 'Best Guide',
            slug: 'best-guide',
          }),
          triggeredBy: factoryTriggeredBy({
            username: 'JEFF123',
          }),
        })

        const notificationDisplay =
          NotificationDisplay.fromNotification(notification)

        expect(notificationDisplay.slug).toBe('library/best-guide#comment:102')
        expect(notificationDisplay.body).toBe('Amazing')
        expect(notificationDisplay.title).toStrictEqual({
          triggeredBy: 'JEFF123',
          middle: 'left a reply',
          parentTitle: 'Best Guide',
          parentSlug: 'library/best-guide',
        })
        expect(notificationDisplay.email).toStrictEqual({
          body: 'Amazing',
          buttonLabel: 'See the full discussion',
          preview: 'JEFF123 has left a new reply',
          subject: 'A new reply on Best Guide',
        })
      })

      it('on questions', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 103,
          contentType: 'reply',
          content: FactoryComment({ id: 103, comment: "I'm not sure." }),
          sourceContentType: 'questions',
          sourceContent: FactoryQuestionItem({
            title: 'Where to start?',
            slug: 'where-to-start',
          }),
          triggeredBy: factoryTriggeredBy({
            username: 'Ben',
          }),
        })

        const notificationDisplay =
          NotificationDisplay.fromNotification(notification)

        expect(notificationDisplay.slug).toBe(
          'questions/where-to-start#comment:103',
        )
        expect(notificationDisplay.body).toBe("I'm not sure.")
        expect(notificationDisplay.title).toStrictEqual({
          triggeredBy: 'Ben',
          middle: 'left a reply',
          parentTitle: 'Where to start?',
          parentSlug: 'questions/where-to-start',
        })
        expect(notificationDisplay.email).toStrictEqual({
          body: "I'm not sure.",
          buttonLabel: 'See the full discussion',
          preview: 'Ben has left a new reply',
          subject: 'A new reply on Where to start?',
        })
      })

      it('on research update', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 104,
          contentType: 'reply',
          content: FactoryComment({ id: 104, comment: "I'm not sure." }),
          sourceContentType: 'research',
          sourceContent: FactoryResearchItem({
            title: 'New Buildings',
            slug: 'new-buildings',
          }),
          parentContentId: 777,
          parentContent: FactoryResearchItemUpdate({
            id: 777,
            title: 'Digging',
          }),
          triggeredBy: factoryTriggeredBy({
            username: 'Mario',
          }),
        })

        const notificationDisplay =
          NotificationDisplay.fromNotification(notification)

        expect(notificationDisplay.slug).toBe(
          'research/new-buildings?update_777#comment:104',
        )
        expect(notificationDisplay.body).toBe("I'm not sure.")
        expect(notificationDisplay.title).toStrictEqual({
          triggeredBy: 'Mario',
          middle: 'left a reply',
          parentTitle: 'New Buildings: Digging',
          parentSlug: 'research/new-buildings#update_777',
        })
        expect(notificationDisplay.email).toStrictEqual({
          body: "I'm not sure.",
          buttonLabel: 'See the full discussion',
          preview: 'Mario has left a new reply',
          subject: 'A new reply on New Buildings: Digging',
        })
      })
    })

    describe('when new content', () => {
      it('research update', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newContent',
          contentId: 654,
          contentType: 'researchUpdate',
          content: FactoryResearchItemUpdate({
            id: 654,
            title: 'Foundations',
            description: 'We put some tiles down.',
          }),
          sourceContentType: 'research',
          sourceContent: FactoryResearchItem({
            title: 'Second Building',
            slug: 'second-building',
          }),
          triggeredBy: factoryTriggeredBy({
            username: 'Julie',
          }),
        })
        const notificationDisplay =
          NotificationDisplay.fromNotification(notification)

        expect(notificationDisplay.slug).toBe(
          'research/second-building#update_654',
        )
        expect(notificationDisplay.body).toBe('Foundations')
        expect(notificationDisplay.title).toStrictEqual({
          triggeredBy: 'Julie',
          middle: 'published a new update',
          parentTitle: 'Second Building',
          parentSlug: 'research/second-building',
        })
        expect(notificationDisplay.email).toStrictEqual({
          body: 'Foundations:\n\nWe put some tiles down.',
          buttonLabel: 'Join the discussion',
          preview: 'New research update on Second Building',
          subject: 'New update on Second Building',
        })
      })
    })
  })
})
