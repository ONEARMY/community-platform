import { MOCK_DATA } from '../../data';
import { getTenantUser } from '../../utils/TestUtils';

const admin = getTenantUser(MOCK_DATA.users.admin);

describe('[Admin - Profile Types]', () => {
  it('[Admin can manage profile types]', () => {
    cy.signIn(admin.email, admin.password);
    cy.visit('/admin/profile-types');
    cy.contains('h1', 'Profile Types');

    cy.step('Admin cannot add a new profile type if form fields are empty');
    cy.contains('button', 'New Profile Type').click();
    cy.get('#profile-type-name').type('Testy McTestFace');
    cy.saveDialog();
    cy.expectFieldError('Map Pin Name');
    cy.get('[data-slot=dialog-close]').click();
    cy.get('body').should('not.contain', 'Testy McTestFace');

    cy.step('Admin can edit profile type');
    cy.adminAction('Edit', 'member');
    cy.get('#profile-type-description').type('Testy McTestFace');
    cy.saveDialog();
    cy.expectToast('Profile type saved');
    cy.get('body').should('contain', 'Testy McTestFace');

    cy.step('Admin cannot delete a profile type that is in use');
    cy.expectActionBlocked('member', 'Cannot be deleted');
  });
});
