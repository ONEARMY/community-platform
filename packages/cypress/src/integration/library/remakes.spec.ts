import { MOCK_DATA } from '../../data';
import { generateNewUserDetails } from '../../utils/TestUtils';

describe('[Library.Remakes]', () => {
  it('shows the remakes empty state on a project page', () => {
    const project = MOCK_DATA.projects[0];
    cy.visit(`/library/${project.slug}`);

    cy.get('[data-cy=remakes-section]').scrollIntoView().should('be.visible');
    cy.get('[data-cy=remakes-count]').contains('Remakes');
    cy.get('[data-cy=remakes-empty-state]').contains('Make this and share with us!');
    cy.get('[data-cy=upload-remake]').should('be.visible');
  });

  it('redirects logged out users to sign in when uploading', () => {
    const project = MOCK_DATA.projects[0];
    cy.visit(`/library/${project.slug}`);

    cy.get('[data-cy=upload-remake]').click();
    cy.url().should('include', '/sign-in');
  });

  it('allows authenticated users to add, edit and delete a remake', () => {
    const user = generateNewUserDetails();
    const project = MOCK_DATA.projects[2];
    const projectPath = `/library/${project.slug}`;

    const description = `Made this at our local workshop. ${user.username}`;
    const updatedDescription = `Made this at our local workshop, second attempt. ${user.username}`;

    cy.signUpCompletedUser(user);
    cy.visit(projectPath);

    cy.step('Cannot publish a remake without an image');
    cy.get('[data-cy=upload-remake]').click();
    cy.get('[data-cy=remake-form-modal]').should('be.visible');
    cy.get('[data-cy=remake-submit]').click();
    cy.get('[data-cy=remake-images-error]').contains('Upload at least 1 image');
    cy.get('[data-cy=errors-container]').should('be.visible');

    cy.step('Can publish a remake with an image and description');
    cy.get('[data-cy=remake-image-upload]')
      .find(':file')
      .selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
    cy.get('[data-cy=remake-image-0]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy=remake-description-input]').type(description);
    cy.get('[data-cy=remake-submit]').click();

    cy.get('[data-cy=remake-form-modal]').should('not.exist');
    cy.get('[data-cy=remakes-count]').contains('1 remake');
    cy.get('[data-cy=remake-card]').should('have.length', 1);
    cy.get('[data-cy=remake-ghost-card]').should('be.visible');

    cy.step('Can view the remake in the modal');
    cy.get('[data-cy=remake-card]').first().click();
    cy.get('[data-cy=remake-view-modal]').should('be.visible');
    cy.get('[data-cy=remake-description]').contains(description);

    cy.step('Can edit their own remake');
    cy.get('[data-cy="RemakeItem: ActionSetButton"]').click();
    cy.get('[data-cy=remake-edit]').click();
    cy.get('[data-cy=remake-form-modal]').should('be.visible');
    cy.get('[data-cy=remake-description-input]').clear().type(updatedDescription);
    cy.get('[data-cy=remake-submit]').click();

    cy.get('[data-cy=remake-form-modal]').should('not.exist');
    cy.get('[data-cy=remake-card]').first().click();
    cy.get('[data-cy=remake-description]').contains(updatedDescription);
    cy.get('[data-cy=remake-modal-close]').click();

    cy.step('Warns about unsaved changes when leaving the form');
    cy.get('[data-cy=remake-card]').first().click();
    cy.get('[data-cy="RemakeItem: ActionSetButton"]').click();
    cy.get('[data-cy=remake-edit]').click();
    cy.get('[data-cy=remake-description-input]').clear().type('Unsaved change');
    cy.get('[data-cy=remake-cancel]').click();
    cy.contains('You have unsaved changes. Are you sure you want to leave?');
    cy.get('[data-cy="Confirm.modal: Cancel"]').click();

    cy.step('Can delete their remake from the edit form');
    cy.get('[data-cy=remake-cancel]').click();
    cy.contains('You have unsaved changes. Are you sure you want to leave?');
    cy.get('[data-cy="Confirm.modal: Confirm"]').click();

    cy.get('[data-cy=remake-card]').first().click();
    cy.get('[data-cy="RemakeItem: ActionSetButton"]').click();
    cy.get('[data-cy=remake-edit]').click();
    cy.get('[data-cy=remake-form-delete]').click();
    cy.contains('Are you sure you want to delete this remake?');
    cy.get('[data-cy="Confirm.modal: Confirm"]').click();

    cy.get('[data-cy=remakes-empty-state]').should('be.visible');
  });
});
