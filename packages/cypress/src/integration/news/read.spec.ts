import { MOCK_DATA } from '../../data';

const news = MOCK_DATA.news[0];

describe('[News.Read]', () => {
  describe('[List news]', () => {
    it('[By Everyone]', () => {
      cy.visit(`/news/`);
      cy.step('Has expected page title');
      cy.title().should('include', `News`);

      cy.step('News displays expected fields');
      cy.get('[data-cy=news-list-item]')
        .first()
        .within(() => {
          cy.get('[data-cy=news-list-item-title]');
          cy.get('[data-cy=news-list-item-summary]');
          cy.get('[data-cy=category]');
        });
    });
  });

  describe('[Individual news]', () => {
    it('[By Everyone]', () => {
      const { body, slug, title } = news;

      const pageTitle = `${title} - News - Precious Plastic`;

      cy.step('Can visit news');
      cy.visit(`/news/${slug}`);

      cy.step('All metadata visible');
      cy.get('[data-cy=ContentStatistics-views]').contains(/\d/);
      cy.get('[data-cy=ContentStatistics-following]').contains(/\d/);
      cy.get('[data-cy=ContentStatistics-comments]').contains(/\d/);

      cy.step('[Populates title, SEO and social tags]');
      cy.title().should('eq', pageTitle);
      cy.get('meta[name="description"]').should('have.attr', 'content', body);

      // OpenGraph (facebook)
      cy.get('meta[property="og:title"]').should('have.attr', 'content', pageTitle);
      cy.get('meta[property="og:description"]').should('have.attr', 'content', body);

      // Twitter
      cy.get('meta[name="twitter:title"]').should('have.attr', 'content', pageTitle);
      cy.get('meta[name="twitter:description"]').should('have.attr', 'content', body);
      cy.step('Website is clickable');
      cy.contains('a', 'OneArmy').should('have.attr', 'href', 'https://www.onearmy.earth/');

      cy.step('Breadcrumbs work');
      cy.get('[data-cy=breadcrumbsItem]').first().should('contain', 'News');
      cy.get('[data-cy=breadcrumbsItem]').first().children().should('have.attr', 'href').and('equal', `/news`);

      cy.get('[data-cy=breadcrumbsItem]').eq(1).should('contain', title);

      cy.step('News images are clickable');

      cy.wait(500);

      // Check content images
      cy.get('[data-cy=news-body] img').first().should('have.css', 'cursor', 'pointer').click();

      // Lightbox should open
      cy.get('.pswp').should('be.visible');

      // Wait for PhotoSwipe animation/initialization
      cy.wait(1000);

      // Close lightbox
      cy.get('button[title="Close"]').click();
      cy.get('.pswp').should('not.exist');
    });
  });
});
