import { MOCK_DATA } from '../../data';

describe('[News.Discussions]', () => {
  it('shows existing comments', () => {
    const news = MOCK_DATA.news[0];
    cy.visit(`/news/${news.slug}`);
    cy.get(`[data-cy=comment-text]`).contains('First comment');
    cy.get('[data-cy=show-replies]').first().click();
    cy.get(`[data-cy="ReplyItem"]`).contains('First Reply');
  });
});
