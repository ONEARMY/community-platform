import { MOCK_DATA } from '../data';
import { UserMenuItem } from '../support/commandsUi';

describe('[Common]', () => {
  it('[Default Page]', () => {
    cy.step('The home page is /academy');
    cy.visit('/').url().should('include', '/academy');
  });

  it('[Not-Found Page]', () => {
    const unknownUrl = '/abcdefghijklm';
    cy.visit(unknownUrl);
    cy.get('[data-test="NotFound: Heading"]')
      .contains(`Nada, page not found 💩`)
      .should('be.visible');
    cy.get('a').contains('home page').should('have.attr', 'href').and('eq', '/');
  });

  it('[Page Navigation]', () => {
    cy.visit('/library');
    cy.wait(2000);

    cy.step('Go to Academy page');
    cy.get('[data-cy=page-link]').contains('Academy').click();
    cy.wait(2000);
    cy.url().should('include', '/academy');

    cy.step('Go to library page');
    cy.get('[data-cy=page-link]').contains('Library').click();
    cy.wait(2000);
    cy.url().should('include', '/library');

    cy.step('Go to Map page');
    cy.get('[data-cy=page-link]').contains('Map').click();
    cy.wait(2000);
    cy.url().should('include', '/map');
  });

  it('[Forbidden Page]', () => {
    cy.step('When not given page details');
    cy.visit('/forbidden');
    cy.contains("You don't have the right permissions");
    cy.contains('Report the problem');

    cy.visit('/forbidden?page=news-create');
    cy.contains('This is a new feature');
    cy.contains('I want to use it');
  });

  describe('[User feedback button]', () => {
    it('[Desktop]', () => {
      cy.visit('/library');
      cy.wait(2000);
      cy.get('[data-cy=feedback]').should('contain', 'Report a Problem');
      cy.get('[data-cy=feedback]')
        .should('have.attr', 'href')
        .and('contain', '/library?sort=Newest');

      cy.visit('/map');
      cy.wait(2000);
      cy.get('[data-cy=feedback]').should('have.attr', 'href').and('contain', '/map');
    });

    it('[Mobile]', () => {
      cy.viewport('iphone-6');

      cy.visit('/library');
      cy.wait(2000);
      cy.get('[data-cy=feedback]').should('contain', 'Problem?');
      cy.get('[data-cy=feedback]')
        .should('have.attr', 'href')
        .and('contain', '/library?sort=Newest');

      cy.visit('/map');
      cy.wait(2000);
      cy.get('[data-cy=feedback]').should('have.attr', 'href').and('contain', '/map');
    });
  });

  describe('[User Menu]', () => {
    it('[By Anonymous]', () => {
      cy.step('Login and Join buttons are available');
      cy.visit('/library');
      cy.wait(2000);
      cy.get('[data-cy=login]').should('be.visible');
      cy.get('[data-cy=join]').should('be.visible');
      cy.get('[data-cy=user-menu]').should('not.exist');
    });

    it('[By Authenticated]', () => {
      cy.step('Login and Join buttons are unavailable to logged-in users');
      cy.signIn(MOCK_DATA.users.subscriber.email, MOCK_DATA.users.subscriber.password);
      cy.visit('/library');
      cy.wait(2000);
      cy.get('[data-cy=login]', { timeout: 20000 }).should('not.exist');
      cy.get('[data-cy=join]').should('not.exist');

      cy.step('User Menu is toggle');
      cy.toggleUserMenuOn();
      cy.get('[data-cy=user-menu-list]').should('be.visible');
      cy.toggleUserMenuOff();
      cy.get('[data-cy=user-menu-list]').should('not.exist');

      cy.step('Go to Profile');
      cy.clickMenuItem(UserMenuItem.Profile);
      cy.url().should('include', `/u/${MOCK_DATA.users.subscriber.username}`);

      cy.step('Go to Settings');
      cy.toggleUserMenuOn();
      cy.clickMenuItem(UserMenuItem.Settings);
      cy.url().should('include', 'settings');

      cy.step('Logout the session');
      cy.toggleUserMenuOn();
      cy.clickMenuItem(UserMenuItem.LogOut);
      cy.wait(2000);
      cy.get('[data-cy=login]', { timeout: 20000 }).should('be.visible');
      cy.get('[data-cy=join]').should('be.visible');
    });
  });
});
