import { users } from 'oa-shared/mocks/data';

import { generateAlphaNumeric, getTenantUser, generateNewUserDetails } from '../../utils/TestUtils';

describe('[News.Write]', () => {
  it('Create and update', () => {
    const initialRandomId = generateAlphaNumeric(8).toLowerCase();

    const initialTitle = `${initialRandomId} Amazing new thing`;
    const initialExpectedSlug = `/news/${initialRandomId}-amazing-new-thing`;
    const initialNewsBodyOne = 'Yo.';
    const initialNewsBodyTwo = 'HiHi!';
    const initialNewsBodyThree = 'We did good.';
    const initialSummary = `${initialNewsBodyOne} ${initialNewsBodyTwo} ${initialNewsBodyThree}`;
    const category = 'Moulds';
    const tag1 = 'product';
    const tag2 = 'workshop';
    const updatedTitle = `Still an amazing thing ${initialRandomId}`;
    const updatedExpectedSlug = `news/still-an-amazing-thing-${initialRandomId}`;
    const updatedNewsBody = 'PLUS sparkles!';
    const updatedSummary = `${updatedNewsBody} ${initialNewsBodyOne} ${initialNewsBodyTwo}`;

    cy.visit('/news');
    const user = getTenantUser(users.admin);
    cy.signIn(user.email, user.password);

    cy.step('Create a news item');
    cy.visit('/news/create');
    cy.get('[data-cy=field-title]', { timeout: 20000 });
    cy.get('[data-cy=field-title]').clear().type(initialTitle).blur({ force: true });
    cy.get('[data-cy=heroImage-upload]').find(':file').selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });

    cy.step('Can add draft news');
    cy.get('[data-cy=field-title]').clear().type(initialTitle).blur({ force: true });

    cy.addToMarkdownField(initialNewsBodyOne);
    cy.addToMarkdownField(initialNewsBodyTwo);
    cy.addToMarkdownField(initialNewsBodyThree);

    cy.get('[data-cy=draft]').click();
    cy.wait(2000);
    cy.url().should('include', initialExpectedSlug);

    cy.step('Can get to drafts');
    cy.visit('/news');
    cy.contains(initialTitle).should('not.exist');
    cy.get('[data-cy=my-drafts]').first().click({ force: true });
    cy.contains(initialTitle).click();

    cy.step('Shows draft news');
    cy.get('[data-cy=draft-tag]').should('be.visible');
    cy.contains(initialNewsBodyOne);

    cy.step('No notification generated yet')
    cy.expectNoNewNotification()

    cy.step('Submit news');
    cy.get('[data-cy=edit]').click();

    cy.selectTag(category, '[data-cy=category-select]');
    cy.selectTag(tag1, '[data-cy="tag-select"]');
    cy.selectTag(tag2, '[data-cy="tag-select"]');

    cy.get('[data-cy=errors-container]').should('not.exist');
    cy.wait(2000);
    cy.get('[data-cy=submit]').click();

    cy.wait(2000);
    cy.url().should('include', initialExpectedSlug);

    cy.step('All news fields shown');
    cy.visit('/news');
    cy.get('[data-cy=news-list-item-summary]').first().contains(initialSummary);
    cy.get('[data-cy=news-list-item]').contains(initialTitle).click();

    cy.contains(initialTitle);
    cy.contains(initialNewsBodyOne);
    cy.contains(initialNewsBodyTwo);
    cy.contains(initialNewsBodyThree);
    cy.contains(category);
    cy.contains(tag1);
    cy.contains(tag2);
    // contains images

    cy.step('All ready for a discussion');
    cy.get('[data-cy=DiscussionTitle]').contains('Start the discussion');
    cy.get('[data-cy=follow-button]').contains('Following Comments');

    cy.step('Notification generated for update');
    cy.expectNewNotification({
      content: initialNewsBodyOne,
      path: initialExpectedSlug,
      title: initialTitle,
      username: user.username,
    });

    cy.step('Edit fields');
    cy.wait(2000);
    cy.get('[data-cy=edit]').click();
    cy.wait(2000);
    cy.url().should('include', `${initialExpectedSlug}/edit`);

    cy.get('[data-cy=field-title]').clear().type(updatedTitle).blur();
    cy.get('.mdxeditor-root-contenteditable').type('{selectAll}{del}');

    cy.addToMarkdownField(updatedNewsBody);
    cy.addToMarkdownField(initialNewsBodyOne);
    cy.addToMarkdownField(initialNewsBodyTwo);
    cy.addToMarkdownField(initialNewsBodyThree);

    cy.step('Replace hero image');
    cy.get('[data-cy=existingHeroImage]').should('exist');
    cy.get('[data-cy=existingHeroImage]').find('[data-cy=delete-image]').click({force: true});
    cy.get('[data-cy=heroImage-upload]').find(':file').selectFile('src/fixtures/images/howto-step-pic2.jpg', { force: true });
    cy.get('[data-cy=delete-image]').should('exist');

    cy.step('Updated news details shown');
    cy.wait(2000);
    cy.get('[data-cy=submit]').click();
    cy.wait(2000);
    cy.url().should('include', updatedExpectedSlug);
    cy.contains(updatedNewsBody);

    cy.contains(updatedTitle);
    cy.contains(updatedNewsBody);
    cy.contains(initialNewsBodyOne);
    cy.contains(initialNewsBodyTwo);
    cy.contains(initialNewsBodyThree);
    cy.get('[data-cy=follow-button]').first().should('contain', 'Following Comments');

    cy.step('Can access the news with the previous slug');
    cy.visit(initialExpectedSlug);
    cy.contains(updatedTitle);

    cy.step('All updated fields visible on list');
    cy.visit('/news');
    cy.contains(updatedSummary);
    cy.contains(updatedTitle);
    cy.contains(category);
  });

  it('Create only for badgers', () => {
    const initialRandomId = generateAlphaNumeric(5).toLowerCase();
    const title = `Important update for PRO: ${initialRandomId}`;
    const path = `/news/important-update-for-pro-${initialRandomId}`;
    const content = 'PRO Badger update';

    cy.step("Create a new (non-badge) user")
    cy.visit('/news');
    const user = generateNewUserDetails();
    cy.signUpNewUser(user);

    cy.step('Create a news item');
    cy.logout();
    const creator = getTenantUser(users.admin);

    cy.signIn(creator.email, creator.password);
    cy.visit('/news/create');
    cy.get('[data-cy=field-title]', { timeout: 20000 });
    cy.get('[data-cy=field-title]').clear().type(title).blur({ force: true });
    cy.get('[data-cy=heroImage-upload]').find(':file').selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
    cy.addToMarkdownField(content);
    cy.selectTag("PRO", '[data-cy=profileBadge-select]');

    cy.get('[data-cy=errors-container]').should('not.exist');
    cy.wait(2000);
    cy.get('[data-cy=submit]').click();

    cy.wait(2000);
    cy.url().should('include', path);

    cy.step("Shows it's for PRO badgers only")
    cy.get('[data-cy=profileBadge]').contains('only news');

    cy.step('For creator, notification generated for update');
    cy.reload() // Annoying delay generating the notification
    cy.expectNewNotification({
      content,
      path,
      title,
      username: creator.username,
    });

    cy.step('Not visible to logged out users');
    cy.wait(1000);
    cy.logout();
    cy.reload();
    cy.url().should('include', `/sign-in?returnUrl=%2Fnews%2Fimportant-update-for-pro-${initialRandomId}`);

    cy.step('Not visible on the list view');
    cy.visit('/news');
    cy.contains(title).should('not.exist');

    cy.step("Logged in user (who is not an admin) can't view item");
    cy.signIn(user.email, user.password)
    cy.visit(path);
    cy.reload();
    cy.url().should('include', `news`);
    cy.url().should('not.include', path);

    cy.step('For user, no notification generated for update');
    cy.expectNoNewNotification();
  });

  it('[By Anonymous]', () => {
    cy.step('Ask users to login before creating a news');
    cy.visit('/news');
    cy.get('[data-cy=create-news]').should('not.exist');

    cy.visit('/news/create');
    cy.url().should('contain', '/sign-in?returnUrl=%2Fnews%2Fcreate');
  });

  // it('[Admin]', () => {
  // Should check an admin can edit other's content
  // })
});
