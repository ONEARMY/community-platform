import { MOCK_DATA } from '../../data';
import { getTenantUser } from '../../utils/TestUtils';

const admin = getTenantUser(MOCK_DATA.users.admin);

describe('[Admin - Projects]', () => {
  it('[Admin can open the projects overview]', () => {
    cy.signIn(admin.email, admin.password);
    cy.visit('/admin/projects');
    cy.contains('h1', 'Projects');
  });
});
