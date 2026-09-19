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
  
});
