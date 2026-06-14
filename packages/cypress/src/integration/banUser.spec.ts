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
      cy.get('[data-cy=BanUserModal]').should('be.visible');
      cy.contains('Ban User - This action will:');

      cy.step('Confirm button should be disabled until checkbox is checked');
      cy.get('[data-cy="BanUserModal: Confirm"]').should('be.disabled');

      cy.step('Check confirmation checkbox');
      cy.get('[data-cy=BanUserConfirmCheckbox]').click({ force: true });

      cy.step('Confirm button should be enabled');
      cy.get('[data-cy="BanUserModal: Confirm"]').should('not.be.disabled');

      cy.step('Confirm ban');
      cy.get('[data-cy="BanUserModal: Confirm"]').click({ force: true});

      cy.step('Should show success toast and redirect');
      cy.contains('User banned successfully');
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);

      cy.step('Banned user profile should show user not found');
      cy.visit(`/u/${regularUser.username}`, { failOnStatusCode: false });
      cy.url().should('include', `/u/${regularUser.username}`);
      cy.contains('User not found');
    });

    it('[Cannot ban user with admin role]', () => {
      cy.step('Admin logs in');
      cy.signIn(admin.email, admin.password);

      cy.step('Go to another admin profile');
      cy.visit(`/u/${admin.username}`);

      cy.step('Ban button should not be visible on own profile');
      cy.get('[data-cy=BanUserButton]').should('not.exist');
    });

    it('[Can cancel ban modal]', () => {
      cy.step('Create a regular user');
      const regularUser = generateNewUserDetails();
      cy.signUpNewUser(regularUser);
      cy.setProfileUsername(regularUser.username);
      cy.logout();

      cy.step('Admin logs in');
      cy.signIn(admin.email, admin.password);

      cy.step('Go to regular user profile');
      cy.visit(`/u/${regularUser.username}`);

      cy.step('Open ban modal');
      cy.get('[data-cy=BanUserButton]').click();
      cy.get('[data-cy=BanUserModal]').should('be.visible');

      cy.step('Cancel the modal');
      cy.get('[data-cy="BanUserModal: Cancel"]').click();

      cy.step('Modal should be closed');
      cy.get('[data-cy=BanUserModal]').should('not.exist');

      cy.step('User should still exist');
      cy.visit(`/u/${regularUser.username}`);
      cy.url().should('include', `/u/${regularUser.username}`);
    });
  });

  describe('[By Regular User]', () => {
    it('[Regular user cannot see ban button]', () => {
      cy.step('Create two regular users');
      const user1 = generateNewUserDetails();
      const user2 = generateNewUserDetails();

      cy.signUpNewUser(user1);
      cy.setProfileUsername(user1.username);
      cy.logout();

      cy.signUpNewUser(user2);
      cy.setProfileUsername(user2.username);

      cy.step('Visit another user profile');
      cy.visit(`/u/${user1.username}`);

      cy.step('Ban button should not be visible');
      cy.get('[data-cy=BanUserButton]').should('not.exist');
    });
  });

  describe('[By Anonymous]', () => {
    it('[Anonymous user cannot see ban button]', () => {
      cy.step('Create a regular user');
      const regularUser = generateNewUserDetails();
      cy.signUpNewUser(regularUser);
      cy.setProfileUsername(regularUser.username);
      cy.logout();

      cy.step('Visit user profile as anonymous');
      cy.visit(`/u/${regularUser.username}`);

      cy.step('Ban button should not be visible');
      cy.get('[data-cy=BanUserButton]').should('not.exist');
    });
  });
});
