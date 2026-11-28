import { MOCK_DATA } from '../../data';
import { getTenantUser } from '../../utils/TestUtils';

const admin = getTenantUser(MOCK_DATA.users.admin);
const member = getTenantUser(MOCK_DATA.users.subscriber);

const expectForbidden = (path: string) => {
  cy.visit(path);
  cy.location('pathname').should('eq', '/forbidden');
  cy.location('search').should('eq', '?page=admin');
  cy.contains('h1', 'Restricted area');
};

describe('[Admin - Access]', () => {
  it('[Only admins can get into the admin panel]', () => {
    cy.step('Signed out visitors are sent to sign in');
    cy.visit('/admin');
    cy.location('pathname').should('eq', '/sign-in');
    cy.location('search').should('eq', '?returnUrl=%2Fadmin');

    cy.step('Admins return to the users overview after signing in');
    cy.get('input[name="cf-turnstile-token"]').should('not.have.value', '');
    cy.get('[data-cy=email]').type(admin.email);
    cy.get('[data-cy=password]').type(admin.password);
    cy.get('[data-cy=submit]').should('be.enabled').click();
    cy.location('pathname').should('eq', '/admin/users');
    cy.contains('h1', 'Overview');

    cy.step('Members without the admin role are shown the forbidden page');
    cy.logout();
    cy.signIn(member.email, member.password);
    expectForbidden('/admin');
    expectForbidden('/admin/tags');
  });
});
