import { NotificationDisplay } from 'oa-shared';
import { describe, expect, it } from 'vitest';

import { FactoryComment } from '../factories/Comment';
import { FactoryResearchItemUpdate } from '../factories/ResearchItem';
import { factorySupabaseNotification, factoryTriggeredBy } from '../factories/supabaseNotification';

describe('NotificationDisplay', () => {
  describe('fromNotification', () => {
    describe('when a new comment', () => {
      it('on news', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 101,
          contentType: 'comments',
          title: 'New thing coming',
          content: FactoryComment({ id: 101, comment: 'Great work' }),
          triggeredBy: factoryTriggeredBy({
            username: 'dave0',
          }),
        });

        const notificationDisplay = NotificationDisplay.fromNotification(notification);

        expect(notificationDisplay.link).toBe('/redirect?id=101&ct=comments');
        expect(notificationDisplay.body).toBe('Great work');
        expect(notificationDisplay.title).toBe('left a comment on New thing coming');
        expect(notificationDisplay.triggeredBy).toBe('dave0');
        expect(notificationDisplay.email).toStrictEqual({
          body: 'Great work',
          buttonLabel: 'See the full discussion',
          preview: 'dave0 has left a new comment',
          subject: 'New comment on New thing coming',
        });
      });

      it('on library', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 102,
          contentType: 'comments',
          title: 'Best Guide',
          content: FactoryComment({ id: 102, comment: 'Amazing' }),
          triggeredBy: factoryTriggeredBy({
            username: 'JEFF123',
          }),
        });

        const notificationDisplay = NotificationDisplay.fromNotification(notification);

        expect(notificationDisplay.link).toBe('/redirect?id=102&ct=comments');
        expect(notificationDisplay.body).toBe('Amazing');
        expect(notificationDisplay.title).toBe('left a comment on Best Guide');
        expect(notificationDisplay.triggeredBy).toBe('JEFF123');
        expect(notificationDisplay.email).toStrictEqual({
          body: 'Amazing',
          buttonLabel: 'See the full discussion',
          preview: 'JEFF123 has left a new comment',
          subject: 'New comment on Best Guide',
        });
      });

      it('on questions', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 103,
          contentType: 'comments',
          title: 'Where to start?',
          content: FactoryComment({ id: 103, comment: "I'm not sure." }),
          triggeredBy: factoryTriggeredBy({
            username: 'Ben',
          }),
        });

        const notificationDisplay = NotificationDisplay.fromNotification(notification);

        expect(notificationDisplay.link).toBe('/redirect?id=103&ct=comments');
        expect(notificationDisplay.body).toBe("I'm not sure.");
        expect(notificationDisplay.title).toBe('left a comment on Where to start?');
        expect(notificationDisplay.triggeredBy).toBe('Ben');
        expect(notificationDisplay.email).toStrictEqual({
          body: "I'm not sure.",
          buttonLabel: 'See the full discussion',
          preview: 'Ben has left a new comment',
          subject: 'New comment on Where to start?',
        });
      });

      it('on research update', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newComment',
          contentId: 104,
          contentType: 'comments',
          title: 'New Buildings: Digging',
          content: FactoryComment({ id: 104, comment: "I'm not sure." }),
          triggeredBy: factoryTriggeredBy({
            username: 'Mario',
          }),
        });

        const notificationDisplay = NotificationDisplay.fromNotification(notification);

        expect(notificationDisplay.link).toBe('/redirect?id=104&ct=comments');
        expect(notificationDisplay.body).toBe("I'm not sure.");
        expect(notificationDisplay.title).toBe('left a comment on New Buildings: Digging');
        expect(notificationDisplay.triggeredBy).toBe('Mario');
        expect(notificationDisplay.email).toStrictEqual({
          body: "I'm not sure.",
          buttonLabel: 'See the full discussion',
          preview: 'Mario has left a new comment',
          subject: 'New comment on New Buildings: Digging',
        });
      });
    });

    describe('when a new reply', () => {
      it('on news', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newReply',
          contentId: 101,
          contentType: 'comments',
          content: FactoryComment({ id: 101, comment: 'Great work' }),
          triggeredBy: factoryTriggeredBy({
            username: 'dave0',
          }),
        });

        const notificationDisplay = NotificationDisplay.fromNotification(notification);

        expect(notificationDisplay.link).toBe('/redirect?id=101&ct=comments');
        expect(notificationDisplay.body).toBe('Great work');
        expect(notificationDisplay.title).toBe('left a reply');
        expect(notificationDisplay.triggeredBy).toBe('dave0');
        expect(notificationDisplay.email).toStrictEqual({
          body: 'Great work',
          buttonLabel: 'See the full discussion',
          preview: 'dave0 has left a new reply',
          subject: 'You have a new comment reply!',
        });
      });

      it('on library', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newReply',
          contentId: 102,
          contentType: 'comments',
          content: FactoryComment({ id: 102, comment: 'Amazing' }),
          triggeredBy: factoryTriggeredBy({
            username: 'JEFF123',
          }),
        });

        const notificationDisplay = NotificationDisplay.fromNotification(notification);

        expect(notificationDisplay.link).toBe('/redirect?id=102&ct=comments');
        expect(notificationDisplay.body).toBe('Amazing');
        expect(notificationDisplay.title).toBe('left a reply');
        expect(notificationDisplay.triggeredBy).toBe('JEFF123');
        expect(notificationDisplay.email).toStrictEqual({
          body: 'Amazing',
          buttonLabel: 'See the full discussion',
          preview: 'JEFF123 has left a new reply',
          subject: 'You have a new comment reply!',
        });
      });

      it('on questions', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newReply',
          contentId: 103,
          contentType: 'comments',
          content: FactoryComment({ id: 103, comment: "I'm not sure." }),
          triggeredBy: factoryTriggeredBy({
            username: 'Ben',
          }),
        });

        const notificationDisplay = NotificationDisplay.fromNotification(notification);

        expect(notificationDisplay.link).toBe('/redirect?id=103&ct=comments');
        expect(notificationDisplay.body).toBe("I'm not sure.");
        expect(notificationDisplay.title).toBe('left a reply');
        expect(notificationDisplay.triggeredBy).toBe('Ben');
        expect(notificationDisplay.email).toStrictEqual({
          body: "I'm not sure.",
          buttonLabel: 'See the full discussion',
          preview: 'Ben has left a new reply',
          subject: 'You have a new comment reply!',
        });
      });

      it('on research update', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newReply',
          contentId: 104,
          contentType: 'comments',
          content: FactoryComment({ id: 104, comment: "I'm not sure." }),
          triggeredBy: factoryTriggeredBy({
            username: 'Mario',
          }),
        });

        const notificationDisplay = NotificationDisplay.fromNotification(notification);

        expect(notificationDisplay.link).toBe('/redirect?id=104&ct=comments');
        expect(notificationDisplay.body).toBe("I'm not sure.");
        expect(notificationDisplay.title).toBe('left a reply');
        expect(notificationDisplay.triggeredBy).toBe('Mario');
        expect(notificationDisplay.email).toStrictEqual({
          body: "I'm not sure.",
          buttonLabel: 'See the full discussion',
          preview: 'Mario has left a new reply',
          subject: 'You have a new comment reply!',
        });
      });
    });

    describe('when new content', () => {
      it('research update', () => {
        const notification = factorySupabaseNotification({
          actionType: 'newContent',
          contentId: 654,
          contentType: 'research_updates',
          content: FactoryResearchItemUpdate({
            id: 654,
            title: 'Foundations',
            description: 'We put some tiles down.',
          }),
          triggeredBy: factoryTriggeredBy({
            username: 'Julie',
          }),
          title: 'Second Building',
        });
        const notificationDisplay = NotificationDisplay.fromNotification(notification);

        expect(notificationDisplay.link).toBe('/redirect?id=654&ct=research_updates');
        expect(notificationDisplay.body).toBe('Foundations');
        expect(notificationDisplay.title).toBe('published a new update on Second Building');
        expect(notificationDisplay.triggeredBy).toBe('Julie');
        expect(notificationDisplay.email).toStrictEqual({
          body: 'Foundations:\n\nWe put some tiles down.',
          buttonLabel: 'Join the discussion',
          preview: 'New research update on Second Building',
          subject: 'New update on Second Building',
        });
      });
    });
  });
});
