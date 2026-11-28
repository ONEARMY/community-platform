import { MOCK_DATA } from '../../data';
import { getTenantUser } from '../../utils/TestUtils';

const admin = getTenantUser(MOCK_DATA.users.admin);

describe('[Admin - Remakes]', () => {
  it('[Admin can open the remakes overview]', () => {
    cy.signIn(admin.email, admin.password);
    cy.visit('/admin/remakes');
    cy.contains('h1', 'Remakes');
  });
});
