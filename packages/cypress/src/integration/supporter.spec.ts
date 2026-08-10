import { MOCK_DATA } from '../data';
import { getTenantUser } from '../utils/TestUtils';

const supporter = getTenantUser(MOCK_DATA.users.subscriber);

const stripeReturnUrl = (email: string) =>
  `/support?payment=success&customer=cus_stubbed&email=${encodeURIComponent(email)}&name=Test%20Supporter`;

describe('[Supporter]', () => {
  it('[Collects supporter details and starts checkout]', () => {
    cy.step('Stub the checkout call so the flow stops at the Stripe boundary');
    cy.intercept('POST', '/api/stripe', {
      statusCode: 500,
      body: { error: 'stubbed at the Stripe boundary' },
    }).as('startCheckout');

    cy.visit('/support');

    cy.step('Choose a plan and fill in supporter details');
    cy.get('[data-cy=price-option]').first().click();
    cy.get('[data-cy=supporter-name]').clear().type('Test Supporter');
    cy.get('[data-cy=supporter-email]').clear().type(supporter.email);

    cy.step('Submitting sends the selected plan and details to the server');
    cy.get('[data-cy=supporter-submit]').click();

    cy.wait('@startCheckout').its('request.body').should('deep.include', {
      action: 'elements_subscription',
      name: 'Test Supporter',
      email: supporter.email,
    });
  });

  it('[Sets up the account after payment and lands on email preferences]', () => {
    cy.step('Stub the account endpoints that would otherwise talk to Stripe');
    cy.intercept('POST', '/api/stripe/create-account', {
      statusCode: 200,
      body: { success: true },
    }).as('createAccount');
    cy.intercept('POST', '/api/stripe/set-password', {
      statusCode: 200,
      body: { success: true },
    }).as('setPassword');

    cy.step('Return from Stripe as a paid supporter');
    cy.visit(stripeReturnUrl(supporter.email));
    cy.wait('@createAccount');

    cy.step('Set a password to finish creating the account');
    cy.get('[data-cy=supporter-account-form]').should('be.visible');
    cy.get('[data-cy=supporter-password]').type(supporter.password);
    cy.get('[data-cy=supporter-set-password]').click();
    cy.wait('@setPassword');

    cy.step('New supporters are sent to their email preferences');
    cy.url().should('include', '/setup-email-preferences');
  });
});
