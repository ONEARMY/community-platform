import { Page } from '../utils/TestUtils';

describe('[Academy]', () => {
  describe('[List instructions]', () => {
    it('[By Everyone]', () => {
      cy.visit(Page.ACADEMY);
      cy.step('Load instructions from another github repo');
      cy.get('iframe').should('have.attr', 'src').and('contain', 'https://onearmy.github.io/academy');
    });
  });
});
