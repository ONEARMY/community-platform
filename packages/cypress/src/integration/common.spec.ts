import { MOCK_DATA } from '../data';
import { UserMenuItem } from '../support/commandsUi';
import { getTenantUser } from '../utils/TestUtils';

describe('[Common]', () => {
  it('[Default Page]', () => {
    cy.step('The home page is /news');
    cy.visit('/').url().should('include', '/news');
  });

  it('[Page Navigation]', () => {
    cy.visit('/library');

    cy.step('Go to Academy page');
    cy.get('[data-cy=page-link]:visible').contains('Academy').click();
    cy.url().should('include', '/academy/intro');

    cy.step('Go to library page');
    cy.get('[data-cy=page-link]:visible').contains('Projects').click();
    cy.get('[data-cy=page-link]:visible').contains('Library').click();
    cy.url().should('include', '/library');
  });

  describe('[User Menu]', () => {
    it('[By Anonymous]', () => {
      cy.step('Login and Join buttons are available');
      cy.visit('/library');
      cy.get('[data-cy=login]').should('be.visible');
      cy.get('[data-cy=join]').should('be.visible');
      cy.get('[data-cy=user-menu]').should('not.exist');
    });

    it('[By Authenticated]', () => {
      const subscriber = getTenantUser(MOCK_DATA.users.subscriber);
      
      cy.step('Login and Join buttons are unavailable to logged-in users');
      cy.signIn(subscriber.email, subscriber.password);
      cy.visit('/library');
      cy.get('[data-cy=login]', { timeout: 20000 }).should('not.exist');
      cy.get('[data-cy=join]').should('not.exist');

      cy.step('User Menu is toggle');
      cy.toggleUserMenuOn();
      cy.get('[data-cy=user-menu-list]').should('be.visible');
      cy.toggleUserMenuOff();
      cy.get('[data-cy=user-menu-list]').should('not.exist');

      cy.step('Go to Profile');
      cy.clickMenuItem(UserMenuItem.Profile);
      cy.url().should('include', `/u/${subscriber.username}`);

      cy.step('Go to Settings');
      cy.toggleUserMenuOn();
      cy.clickMenuItem(UserMenuItem.Settings);
      cy.url().should('include', 'settings');

      cy.step('Logout the session');
      cy.toggleUserMenuOn();
      cy.clickMenuItem(UserMenuItem.LogOut);
      cy.get('[data-cy=login]', { timeout: 20000 }).should('be.visible');
      cy.get('[data-cy=join]').should('be.visible');
    });
  });
});
