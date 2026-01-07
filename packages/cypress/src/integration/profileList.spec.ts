import { MOCK_DATA } from '../data';
import { generateNewUserDetails } from '../utils/TestUtils';

const subscriber = MOCK_DATA.users.subscriber;

describe('[ProfileList Modal]', () => {
  const question = MOCK_DATA.questions[0];
  const { slug } = question;

  it('[Opens the useful voters modal]', () => {
    cy.signIn(subscriber.email, subscriber.password);
    cy.visit(`/questions/${slug}`);
    cy.wait(1000);
    cy.get('[data-cy=ContentStatistics-useful]').should('be.visible').click();
    cy.wait(500);
    cy.get('[data-cy=profile-list-modal]').should('be.visible');
    cy.get('[data-cy=profile-list-modal]').within(() => {
      cy.contains('Others that found it useful');
      cy.contains('demo_user');
    });
    cy.get('[data-cy=profile-list-modal] button[icon="close"]').click();
  });

  it('[Cannot open the useful voters modal without premium tier]', () => {
    const user = generateNewUserDetails();
    cy.signUpNewUser(user);
    cy.visit(`/questions/${slug}`);
    cy.wait(1000);
    cy.get('[data-cy=ContentStatistics-useful]').should('be.visible').click();
    cy.wait(500);
    cy.get('[data-cy=profile-list-modal]').should('not.exist');
  });

  const questionWithNoUsefulVotes = MOCK_DATA.questions[1];
  const { slug: slugNoVotes } = questionWithNoUsefulVotes;

  it('[Cannot open the useful voters modal when there are no useful votes]', () => {
    cy.signIn(subscriber.email, subscriber.password);
    cy.visit(`/questions/${slugNoVotes}`);
    cy.wait(1000);
    cy.get('[data-cy=ContentStatistics-useful]').should('be.visible').click();
    cy.wait(500);
    cy.get('[data-cy=profile-list-modal]').should('not.exist');
  });
});
