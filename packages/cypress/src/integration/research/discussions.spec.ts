import { MOCK_DATA } from '../../data';

describe('[Research.Discussions]', () => {
  it('shows existing comments', () => {
    const research = MOCK_DATA.research[0];
    cy.visit(`/research/${research.slug}`);
    cy.get('[data-cy="HideDiscussionContainer:button"]').first().click();
    cy.get(`[data-cy=comment-text]`).contains('First comment');
    cy.get('[data-cy=show-replies]').first().click();
    cy.get(`[data-cy="ReplyItem"]`).contains('First Reply');
  });
});
