import { users } from 'oa-shared/mocks/data';
import { getTenantUser } from '../../utils/TestUtils';

describe('[Polls.Write]', () => {
  it('Create and update poll attached to news', () => {
    const newsTitle = "News with Poll!!";
    const newsBody = "Yo. This one has a Poll!";

    const initialPollTitle = "What do you prefer?";
    const initialOption1 = "This one!";
    const initialOption2 = "No, that one!";
    const initialOption3 = "Both are great."
    const initialOption4 = "I don't like any."

    const updatedPollTitle = "What don't you like?";
    const updatedOption1 = "Maybe this option.";
    const updatedOption2 = "Or the other one.";
    const updatedOption3 = "Everything is bad..."

    cy.visit('/news');
    const user = getTenantUser(users.admin);
    cy.signIn(user.email, user.password);

    cy.step('Create a news item');
    cy.visit('/news/create');
    cy.get('[data-cy=field-title]', { timeout: 20000 });
    cy.get('[data-cy=field-title]').clear().type(newsTitle).blur({ force: true });
    cy.get('[data-cy=heroImage-upload]').find(':file').selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
    cy.addToMarkdownField(newsBody);

    cy.step('Add new poll to news');
    cy.get('[data-cy=add-news]').click();
    cy.get('[data-cy=field-poll-title]').should('be.visible');
    cy.get('[data-cy=field-poll-title]').clear().type(initialPollTitle).blur({ force: true });

    cy.step('Fill in options')
    cy.get('[data-cy=field-poll-option-0]').should('be.visible');
    cy.get('[data-cy=field-poll-option-0]').clear().type(initialOption1).blur({ force: true });
    cy.get('[data-cy=field-poll-option-1]').should('be.visible');
    cy.get('[data-cy=field-poll-option-1]').clear().type(initialOption2).blur({ force: true });
    cy.get('[data-cy=field-poll-option-2]').should('be.visible');
    cy.get('[data-cy=field-poll-option-2]').clear().type(initialOption3).blur({ force: true });

    cy.get('[data-cy=field-poll-option-3]').should('not.exist');

    cy.step('Add 4th option')
    cy.get('[data-cy=poll-add-option]').click();
    cy.get('[data-cy=field-poll-option-3]').should('be.visible');
    cy.get('[data-cy=field-poll-option-3]').clear().type(initialOption4).blur({ force: true });

    cy.step('Publish news');
    cy.get('[data-cy=errors-container]').should('not.exist');
    cy.get('[data-cy=submit]').click();
    cy.wait(2000);
    cy.get('[data-cy=toast]').contains('News published');

    cy.step('Poll is shown in news');
    cy.visit('/news');
    cy.get('[data-cy=news-list-item]').contains(newsTitle).click();

    cy.contains(initialPollTitle);
    cy.contains(initialOption1);
    cy.contains(initialOption2);
    cy.contains(initialOption3);
    cy.contains(initialOption4);

    cy.step('Navigate to edit page');
    cy.get('[data-cy=edit]').click();
    cy.wait(2000);

    cy.step('Change title and option descriptions');
    cy.get('[data-cy=field-poll-title]').clear().type(updatedPollTitle).blur({ force: true });
    cy.get('[data-cy=field-poll-option-0]').clear().type(updatedOption1).blur({ force: true });
    cy.get('[data-cy=field-poll-option-1]').clear().type(updatedOption2).blur({ force: true });
    cy.get('[data-cy=field-poll-option-2]').clear().type(updatedOption3).blur({ force: true });

    cy.step('Remove 4th option')
    cy.get('[data-cy=remove-poll-option-3]').click();
    cy.get('[data-cy=field-poll-option-3]').should('not.exist');


    cy.step('Publish updated news');
    cy.get('[data-cy=errors-container]').should('not.exist');
    cy.get('[data-cy=submit]').click();
    cy.wait(2000);
    cy.get('[data-cy=toast]').contains('News published');

    cy.step('Updated poll is shown in news');
    cy.visit('/news');
    cy.get('[data-cy=news-list-item]').contains(newsTitle).click();

    cy.contains(updatedPollTitle);
    cy.contains(updatedOption1);
    cy.contains(updatedOption2);
    cy.contains(updatedOption3);
  });

  it('Delete poll', () => {
    const newsTitle = "News with poll that will be deleted!";
    const newsBody = "Yo. This one has a Poll!";

    const pollTitle = "This poll is still here?";
    const option1 = "YES";
    const option2 = "IT";
    const option3 = "IS"

    cy.visit('/news');
    const user = getTenantUser(users.admin);
    cy.signIn(user.email, user.password);

    cy.step('Create a news item');
    cy.visit('/news/create');
    cy.get('[data-cy=field-title]', { timeout: 20000 });
    cy.get('[data-cy=field-title]').clear().type(newsTitle).blur({ force: true });
    cy.get('[data-cy=heroImage-upload]').find(':file').selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
    cy.addToMarkdownField(newsBody);

    cy.step('Add poll to news');
    cy.get('[data-cy=add-news]').click();
    cy.get('[data-cy=field-poll-title]').clear().type(pollTitle).blur({ force: true });
    cy.get('[data-cy=field-poll-option-0]').clear().type(option1).blur({ force: true });
    cy.get('[data-cy=field-poll-option-1]').clear().type(option2).blur({ force: true });
    cy.get('[data-cy=field-poll-option-2]').clear().type(option3).blur({ force: true });

    cy.step('Publish and view news with poll')
    cy.get('[data-cy=submit]').click();
    cy.wait(2000);
    cy.get('[data-cy=toast]').contains('News published');
    cy.visit('/news');
    cy.get('[data-cy=news-list-item]').contains(newsTitle).click();
    cy.contains(pollTitle)

    cy.step('Delete poll');
    cy.get('[data-cy=edit]').click();
    cy.wait(2000);
    cy.get('[data-cy=delete-poll]').click();

    cy.step('Save and view news without poll')
    cy.get('[data-cy=submit]').click();
    cy.wait(2000);
    cy.visit('/news');
    cy.get('[data-cy=news-list-item]').contains(newsTitle).click();

    cy.contains(pollTitle).should('not.exist');
  });
});
