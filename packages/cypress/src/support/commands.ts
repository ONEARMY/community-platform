import 'cypress-file-upload'

import { deleteDB } from 'idb'
import { UserRole } from 'oa-shared'

interface ExpectedNewNotification {
  content: string
  path: string
  title: string
  username: string
}

declare global {
  namespace Cypress {
    interface Chainable {
      clearServiceWorkers(): Promise<void>
      deleteIDB(name: string): Promise<boolean>
      expectNewNotification(ExpectedNewNotification): Chainable<void>
      expectNoNewNotification(): Chainable<void>
      interceptAddressSearchFetch(addressResponse): Chainable<void>
      interceptAddressReverseFetch(addressResponse): Chainable<void>
      step(message: string)
    }
  }
}

/**
 * Create custom commands that can be used within cypress chaining and namespace
 * @remark - any called functions should be 'wrapped' in a cy.wrap('some name') statement to allow chaining
 * @remark - async code should be wrapped in a Cypress.promise block to allow the resolved promise to be
 * used in chained results
 */
/** Delete an indexeddb - resolving true on success and false if blocked (open connections) */
Cypress.Commands.add('deleteIDB', (name: string) => {
  cy.wrap('Delete Firebase IDB: ' + name)
    .then(() => {
      return new Cypress.Promise<boolean>((resolve) => {
        // Ensure DB exists - NOTE - only supported in chrome
        // ;(indexedDB as any).databases().then((names: string[]) => {
        //   if (names.includes(name)) {
        deleteDB(name, {
          // blocked implies active connection; for now just resolve false but in the
          // future may want to find better resolution
          blocked: () => resolve(false),
        })
          .then(() => resolve(true))
          .catch(() => resolve(false))
      })
    })
    .then((deleted) => cy.log('deleted?', deleted))
})

Cypress.Commands.add('clearServiceWorkers', () => {
  cy.window().then((w) => {
    cy.wrap('Clearing service workers').then(() => {
      return new Cypress.Promise((resolve) => {
        // if running production builds locally may also need to remove service workers between runs
        if (w.navigator && navigator.serviceWorker) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
              registration.unregister()
            })
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  })
})

Cypress.Commands.add('step', (message: string) => {
  Cypress.log({
    displayName: 'step',
    message: [`**${message}**`],
  })
})

Cypress.Commands.add('interceptAddressSearchFetch', (addressResponse) => {
  cy.intercept('GET', 'https://nominatim.openstreetmap.org/search*', {
    body: addressResponse,
  }).as('fetchAddress')
})

Cypress.Commands.add('interceptAddressReverseFetch', (addressResponse) => {
  cy.intercept('GET', 'https://nominatim.openstreetmap.org/reverse?*', {
    body: addressResponse,
  }).as('fetchAddressReverse')
})

/**
 * Overwrite default logging to also output to console
 * https://github.com/cypress-io/cypress/issues/3199
 */
Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message))

Cypress.Commands.add(
  'expectNewNotification',
  (props: ExpectedNewNotification) => {
    const { content, path, title, username } = props

    localStorage.setItem('devSiteRole', UserRole.BETA_TESTER)
    cy.wait(3000)

    cy.get('[data-cy=NotificationsSupabase-desktop]').within(() => {
      cy.get('[data-cy=notifications-new-messages]').click()
    })
    cy.get('[data-cy=NotificationListSupabase]').contains(username)
    cy.get('[data-cy=NotificationListSupabase]').contains(title)
    cy.get('[data-cy=NotificationListSupabase]').contains(content).click()

    cy.url().should('include', path)
  },
)

Cypress.Commands.add('expectNoNewNotification', () => {
  localStorage.setItem('devSiteRole', UserRole.BETA_TESTER)
  cy.wait(3000)

  cy.get('[data-cy=notifications-no-new-messages]').first()
})
