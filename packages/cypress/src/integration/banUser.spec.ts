import { MOCK_DATA } from '../data';
import { generateNewUserDetails, getTenantUser } from '../utils/TestUtils';

const admin = getTenantUser(MOCK_DATA.users.admin);

describe('[Ban User]', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('[By Admin]', () => {
    it('[Admin can ban a regular user]', () => {
      cy.step('Create a regular user');
      const regularUser = generateNewUserDetails();
      cy.signUpNewUser(regularUser);
      cy.setProfileUsername(regularUser.username);
      cy.logout();

      cy.step('Admin logs in');
      cy.signIn(admin.email, admin.password);

      cy.step('Go to regular user profile');
      cy.visit(`/u/${regularUser.username}`);

      cy.step('Ban button should be visible');
      cy.get('[data-cy=BanUserButton]').should('be.visible');

      cy.step('Open ban modal');
      cy.get('[data-cy=BanUserButton]').click();
      cy.get('[data-cy="Confirm.modal: Modal"]').should('be.visible');
      cy.contains('Ban User - This action will:');

      cy.step('Confirm button should be disabled until checkbox is checked');
      cy.get('[data-cy="Confirm.modal: Confirm"]').should('be.disabled');

      cy.step('Check confirmation checkbox');
      cy.get('[data-cy="Confirm.modal: Checkbox"]').click({ force: true });

      cy.step('Confirm button should be enabled');
      cy.get('[data-cy="Confirm.modal: Confirm"]').should('not.be.disabled');

      cy.step('Confirm ban');
      cy.get('[data-cy="Confirm.modal: Confirm"]').click({ force: true});

      cy.step('Should show success toast and redirect');
      cy.contains('User banned successfully');

      cy.step('Banned user profile should show user not found');
      cy.visit(`/u/${regularUser.username}`, { failOnStatusCode: false });
      cy.url().should('include', `/u/${regularUser.username}`);
      cy.contains('User not found');
    });
  });
});
