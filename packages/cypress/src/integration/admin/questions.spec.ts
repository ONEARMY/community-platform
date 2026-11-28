import { MOCK_DATA } from '../../data';
import { getTenantUser } from '../../utils/TestUtils';

const admin = getTenantUser(MOCK_DATA.users.admin);
const question = MOCK_DATA.questions[0];

describe('[Admin - Questions]', () => {
  it('[Admin can manage questions]', () => {
    cy.signIn(admin.email, admin.password);
    cy.visit('/admin/questions');
    cy.contains('h1', 'Questions');

    cy.step('Question title links to the question page');
    cy.contains('a', question.title).click();
    cy.location('pathname').should('eq', `/questions/${question.slug}`);
    cy.go('back');

    cy.step('Question author links to their profile');
    cy.contains('tr', question.title).find('a[href^="/u/"]').click();
    cy.location('pathname').should('match', /^\/u\//);
    cy.go('back');

    cy.step('Edit links to the question edit page');
    cy.adminAction('Edit', question.title);
    cy.location('pathname').should('eq', `/questions/${question.slug}/edit`);
    cy.contains('Edit your question to the community');
    cy.go('back');

    cy.step('Delete asks for confirmation and can be cancelled');
    cy.adminAction('Delete', question.title);
    cy.contains('[data-slot=dialog-content]', 'Delete Question');
    cy.contains('[data-slot=dialog-footer] button', 'Cancel').click();
    cy.get('[data-slot=dialog-content]').should('not.exist');

    cy.step('Admin can delete a question');
    cy.adminAction('Delete', question.title);
    cy.confirmDialog();
    cy.expectToast('Question deleted');
  });
});
