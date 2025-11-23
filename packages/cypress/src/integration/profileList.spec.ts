import { MOCK_DATA } from '../data';
import { generateNewUserDetails } from '../utils/TestUtils';

describe('[ProfileList Modal]', () => {
  const question = MOCK_DATA.questions[0];
  const { slug } = question;

  it('[Opens the useful voters modal]', () => {
    const user = generateNewUserDetails();
    cy.signUpNewUser(user);
    cy.visit(`/questions/${slug}`);
    cy.contains('1 useful');
    cy.get('[data-cy=stat-star]').should('be.visible').click();
    cy.get('[data-cy=profile-list-modal]').should('be.visible');
    cy.get('[data-cy=profile-list-modal]').within(() => {
      cy.contains('Others that found it useful');
      cy.contains('demo_user');
    });
    cy.get('[data-cy=profile-list-modal] button[icon="close"]').click();
  });

  const questionWithNoUsefulVotes = MOCK_DATA.questions[1];
  const { slug: slugNoVotes } = questionWithNoUsefulVotes;

  it('[Cannot open the useful voters modal when there are no useful votes]', () => {
    const user = generateNewUserDetails();
    cy.signUpNewUser(user);
    cy.visit(`/questions/${slugNoVotes}`);
    cy.get('[data-cy=stat-star]').should('be.visible').click();
    cy.get('[data-cy=profile-list-modal]').should('not.exist');
  });
});
