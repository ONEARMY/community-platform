import { MOCK_DATA } from '../../data';
import { getTenantUser } from '../../utils/TestUtils';

const admin = getTenantUser(MOCK_DATA.users.admin);

describe('[Admin - News]', () => {
  it('[Admin can open the news overview]', () => {
    cy.signIn(admin.email, admin.password);
    cy.visit('/admin/news');
    cy.contains('h1', 'News');
  });
});
