import { users } from 'oa-shared/mocks/data';
import { generateAlphaNumeric, getTenantUser } from '../../utils/TestUtils';

describe('[Polls.Vote]', () => {
  it('Different users vote on poll and see the results after voting', () => {
    const randomId = generateAlphaNumeric(8).toLowerCase();
    const newsTitle = `${randomId} Poll to vote on!`;
    const newsBody = "Yo. This one has a poll to vote on!";

    const pollTitle = "What do you prefer?";
    const option1 = "This one!";
    const option2 = "No, that one!";
    const option3 = "Both are great."

    cy.step('Create a news with poll');
    cy.visit('/news');
    const admin = getTenantUser(users.admin);
    cy.signIn(admin.email, admin.password);

    cy.visit('/news/create');
    cy.get('[data-cy=field-title]', { timeout: 20000 });
    cy.get('[data-cy=field-title]').clear().type(newsTitle).blur({ force: true });
    cy.get('[data-cy=heroImage-upload]').find(':file').selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
    cy.addToMarkdownField(newsBody);

    cy.get('[data-cy=add-news]').click();
    cy.get('[data-cy=field-poll-title]').clear().type(pollTitle).blur({ force: true });
    cy.get('[data-cy=field-poll-option-0]').clear().type(option1).blur({ force: true });
    cy.get('[data-cy=field-poll-option-1]').clear().type(option2).blur({ force: true });
    cy.get('[data-cy=field-poll-option-2]').clear().type(option3).blur({ force: true });

    cy.step('Publish news');
    cy.get('[data-cy=errors-container]').should('not.exist');
    cy.get('[data-cy=submit]').click();
    cy.wait(2000);
    cy.get('[data-cy=toast]').contains('News published');

    cy.step('Log in as first user and vote on poll');
    cy.logout();
    const user1 = getTenantUser(users.subscriber)
    cy.signIn(user1.email, user1.password);
    cy.visit('/news');
    cy.get('[data-cy=news-list-item]').contains(newsTitle).click();

    cy.contains(pollTitle);
    cy.get('[data-cy=poll-option-0]').click();
    cy.get('[data-cy=submit-vote]').click();
    cy.contains("100%");
    cy.contains("0%");
    cy.contains("1 vote");

    cy.step('Log in as second user and vote on poll');
    cy.logout();
    const user2 = getTenantUser(users.research_creator)
    cy.signIn(user2.email, user2.password);
    cy.visit('/news');
    cy.get('[data-cy=news-list-item]').contains(newsTitle).click();

    cy.contains(pollTitle);
    cy.contains("100%").should('not.exist');
    cy.contains("0%").should('not.exist');
    cy.contains("1 vote").should('not.exist');
    cy.get('[data-cy=poll-option-1]').click();
    cy.get('[data-cy=submit-vote]').click();
    cy.contains("50%");
    cy.contains("0%");
    cy.contains("2 votes");

    cy.step('Log in as admin and be able to see results without voting');
    cy.logout();
    cy.signIn(admin.email, admin.password);
    cy.visit('/news');
    cy.get('[data-cy=news-list-item]').contains(newsTitle).click();

    cy.contains(pollTitle);
    cy.contains("50%");
    cy.contains("0%");
    cy.contains("2 votes");
    cy.wait(2000);

    cy.step('Poll results change after voting')
    cy.get('[data-cy=poll-option-1]').click();
    cy.get('[data-cy=submit-vote]').click();
    cy.contains("33%");
    cy.contains("67%");
    cy.contains("0%");
    cy.contains("3 votes");
  });
});
