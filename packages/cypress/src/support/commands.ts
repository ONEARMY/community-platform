export {};

interface ExpectedNewNotification {
  path: string;
  content?: string;
  title?: string;
  username?: string;
}

declare global {
  namespace Cypress {
    interface Chainable {
      clearServiceWorkers(): Promise<void>;
      clearNotifications(): Chainable<void>;
      expectNewNotification(notification: ExpectedNewNotification): Chainable<void>;
      expectNoNewNotification(): Chainable<void>;
      interceptAddressSearchFetch(addressResponse): Chainable<void>;
      interceptAddressReverseFetch(addressResponse): Chainable<void>;
      step(message: string): Chainable<void>;
      waitForUnreadNotification(): Chainable<void>;
    }
  }
}

const NOTIFICATION_POLL_INTERVAL_MS = 250;
const NOTIFICATION_POLL_ATTEMPTS = 60;

Cypress.Commands.add('clearServiceWorkers', () => {
  cy.window().then((w) => {
    cy.wrap('Clearing service workers').then(() => {
      return new Cypress.Promise((resolve) => {
        // if running production builds locally may also need to remove service workers between runs
        if (w.navigator && navigator.serviceWorker) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
              registration.unregister();
            });
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  });
});

Cypress.Commands.add('step', (message: string) => {
  Cypress.log({
    displayName: 'step',
    message: [`**${message}**`],
  });
});

Cypress.Commands.add('interceptAddressSearchFetch', (addressResponse) => {
  cy.intercept('GET', 'https://nominatim.openstreetmap.org/search*', {
    body: addressResponse,
  }).as('fetchAddress');
});

Cypress.Commands.add('interceptAddressReverseFetch', (addressResponse) => {
  cy.intercept('GET', 'https://nominatim.openstreetmap.org/reverse?*', {
    body: addressResponse,
  }).as('fetchAddressReverse');
});

/**
 * Overwrite default logging to also output to console
 * https://github.com/cypress-io/cypress/issues/3199
 */
Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));

function waitForHydration(win: Cypress.AUTWindow) {
  const timeout = Cypress.config('defaultCommandTimeout');
  const startedAt = Date.now();

  return new Cypress.Promise<Cypress.AUTWindow>((resolve, reject) => {
    const check = () => {
      if (win.document.documentElement.dataset.hydrated) {
        return resolve(win);
      }
      if (Date.now() - startedAt > timeout) {
        return reject(new Error(`Page did not hydrate within ${timeout}ms`));
      }
      setTimeout(check, 50);
    };
    check();
  });
}

Cypress.Commands.overwrite<'visit'>('visit', (originalFn, url, options) =>
  originalFn(url, options).then(waitForHydration),
);

const openNotifications = () => {
  cy.get('[data-cy=NotificationsSupabase-desktop]').should('exist');

  cy.get('body').then(($body) => {
    if ($body.find('[data-cy=NotificationListSupabase]').length === 0) {
      cy.get('[data-cy=NotificationsSupabase-desktop]').click();
    }
  });

  cy.get('[data-cy=NotificationListSupabase]').should('be.visible');
};

Cypress.Commands.add('clearNotifications', () => {
  openNotifications();

  cy.get('body').then(($body) => {
    if ($body.find('[data-cy=NotificationListSupabase-MarkAllRead]').length > 0) {
      cy.get('[data-cy=NotificationListSupabase-MarkAllRead]').click();
    }
  });
  cy.get('[data-cy=NotificationListSupabase-CloseButton]').click();
  cy.get('[data-cy=NotificationListSupabase]').should('not.exist');
});

Cypress.Commands.add('expectNewNotification', (props: ExpectedNewNotification) => {
  const { content, path, title, username } = props;

  openNotifications();

  if (username) {
    cy.get('[data-cy=NotificationListSupabase]').contains(username);
  }
  if (title) {
    cy.get('[data-cy=NotificationListSupabase]').contains(title);
  }
  if (content) {
    cy.get('[data-cy=NotificationListSupabase]').contains(content).click();
  }

  cy.url().should('include', path);
});

function pollUnreadNotification(attemptsLeft: number) {
  cy.request({ url: '/api/notifications', log: false }).then(({ body }) => {
    const hasUnread = body.notifications?.some((notification: { isRead: boolean }) => !notification.isRead);

    if (hasUnread) {
      return;
    }
    if (attemptsLeft === 0) {
      throw new Error('No unread notification was generated');
    }
    cy.wait(NOTIFICATION_POLL_INTERVAL_MS, { log: false });
    pollUnreadNotification(attemptsLeft - 1);
  });
}

Cypress.Commands.add('waitForUnreadNotification', () => {
  pollUnreadNotification(NOTIFICATION_POLL_ATTEMPTS);
});

Cypress.Commands.add('expectNoNewNotification', () => {
  cy.get('[data-cy=notifications-no-new-messages]').first();
});
