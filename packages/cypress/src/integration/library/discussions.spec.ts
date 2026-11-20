import { MOCK_DATA } from '../../data';

describe('[Library.Discussions]', () => {
  it('shows existing comments', () => {
    const project = MOCK_DATA.projects[0];
    cy.visit(`/library/${project.slug}`);
    cy.get(`[data-cy=comment-text]`).contains('First comment');
    cy.get('[data-cy=show-replies]').first().click();
    cy.get(`[data-cy="ReplyItem"]`).contains('First Reply');
  });
});
