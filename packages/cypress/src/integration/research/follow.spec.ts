import { users } from "oa-shared/mocks/data";
import { getTenantUser } from "../../utils/TestUtils";

describe('[Research]', () => {
  const researchArticleUrl = '/research/qwerty';
  const researchListUrl = '/research';
  const demoBetaTester = getTenantUser(users['beta-tester']);

  describe('[By Authenticated]', () => {
    it('[Follow button]', () => {
      cy.step('Should exist');
      cy.signIn(demoBetaTester.email, demoBetaTester.password);
      cy.visit(researchArticleUrl);
      cy.wait(1000);
      cy.get('[data-cy="follow-redirect"]').should('not.exist');
      cy.get('[data-cy="follow-button"]').should('be.visible').should('contain.text', 'Follow');

      cy.step('Should follow on click');
      cy.get('[data-cy="follow-button"]').first().click();
      cy.wait(2000);
      cy.get('[data-cy="follow-button"]').first().should('contain.text', 'Following');

      cy.step('Should persist follow status on reload');
      cy.visit(researchArticleUrl);
      cy.wait(1000);
      cy.get('[data-cy="follow-button"]').first().should('contain.text', 'Following');
      cy.get('[data-cy="follow-button"]').first().click();
      cy.wait(2000);
      cy.get('[data-cy="follow-button"]').should('be.visible').should('contain.text', 'Follow');
    });

    it('[Follow icon on list view]', () => {
      cy.step('Should show follow icon when user is following');
      cy.signIn(demoBetaTester.email, demoBetaTester.password);

      cy.step('Follow the item from article view first');
      cy.visit(researchArticleUrl);
      cy.wait(1000);
      cy.get('[data-cy="follow-button"]').first().click();
      cy.wait(2000);

      cy.step('Follow icon should be visible in list view for the followed item');
      cy.visit(researchListUrl);
      cy.wait(2000);
      cy.get('[data-cy=research-search-box]').click().type('qwerty');
      cy.get('[data-cy="ResearchListItem"]').should('exist');
      cy.contains('[data-cy="ResearchListItem"]', 'Qwerty').within(() => {
        cy.get('[data-cy="follow-icon"]').should('exist');
      });
    });
  });
});
