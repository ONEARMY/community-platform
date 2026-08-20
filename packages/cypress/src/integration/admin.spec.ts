import { MOCK_DATA } from '../data';
import { generateNewUserDetails, getTenantUser } from '../utils/TestUtils';

const admin = getTenantUser(MOCK_DATA.users.admin);

describe('[Admin]', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('[Anonymous is redirected to sign-in]', () => {
    cy.visit('/admin');
    cy.url().should('include', '/sign-in');
  });

  it('[Regular user is redirected to forbidden]', () => {
    const regularUser = generateNewUserDetails();
    cy.signUpNewUser(regularUser);
    cy.setProfileUsername(regularUser.username);

    cy.visit('/admin');
    cy.url().should('include', '/forbidden?page=admin');
    cy.contains("You don't have the right permissions");
  });

  it('[Admin can access the admin panel]', () => {
    cy.signIn(admin.email, admin.password);

    cy.visit('/admin');
    cy.url().should('include', '/admin/users');
    cy.contains('Overview');
  });
});
