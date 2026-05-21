import { MOCK_DATA } from '../data';
import { generateNewUserDetails, getTenantUser } from '../utils/TestUtils';

describe('[Sign in]', () => {
  it('[By Anonymous]', () => {
    cy.step('Reset Password requires email');
    cy.visit('/sign-in');
    cy.get('[data-cy=lost-password]').click();
    cy.get('[data-cy=email]').should('be.visible');
  });

  it('keeps the email field after a failed login attempt', () => {
    const user = getTenantUser(MOCK_DATA.users.subscriber);
    const { email } = user;

    cy.visit('/sign-in');
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=password]').type(`${user.password}-wrong`);
    cy.get('[data-cy=submit]').click();

    cy.contains('Invalid email or password.').should('be.visible');
    cy.get('[data-cy=email]').should('have.value', email);
    cy.get('[data-cy=password]').should('have.value', '');
  });
});

describe('[Reset password]', () => {
  it('Validate reset password form', () => {
    const user = generateNewUserDetails();
    const { email } = user;

    cy.step('Reset Password requires email');
    cy.visit('/sign-in');
    cy.get('[data-cy=lost-password]').click({ force: true });
    cy.wait(1000);
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=submit]').click();

    cy.step('Reset Password should go back');
    cy.get('[data-cy=go-back]').should('be.visible');
    cy.wait(1000);
    cy.get('[data-cy=go-back]').click({ force: true });
    cy.get('[data-cy=email]').should('be.visible');
  });
});
