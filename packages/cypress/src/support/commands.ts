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
    }
  }
}

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

Cypress.Commands.add('expectNoNewNotification', () => {
  cy.get('[data-cy=notifications-no-new-messages]').first();
});
