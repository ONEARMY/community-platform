import { faker } from '@faker-js/faker';

import { RESEARCH_TITLE_MIN_LENGTH } from '../../../../../src/pages/Research/constants';
import { MOCK_DATA } from '../../data';
import { generateAlphaNumeric } from '../../utils/TestUtils';

const generateArticle = () => {
  const title = faker.lorem.words(4);
  const slug = title.toLowerCase().split(' ').join('-');

  return {
    _createdBy: 'research_creator',
    _deleted: false,
    description: 'After creating, the research will be deleted.',
    title: title,
    slug: slug,
    previousSlugs: [slug],
    status: 'In progress',
  };
};

const admin = MOCK_DATA.users.admin;
const researcher = MOCK_DATA.users.research_creator;

describe('[Research]', () => {
  beforeEach(() => {
    cy.visit('/research');
  });

  describe('[Create research article]', () => {
    it('[By Authenticated]', () => {
      const initialRandomId = generateAlphaNumeric(4).toLowerCase();
      const initialTitle = initialRandomId + ' Initial Title';
      const initialExpectedSlug = initialRandomId + '-initial-title';

      const expected = generateArticle();

      const updateTitle = faker.lorem.words(5);
      const updateDescription = 'This is the description for the update.';
      const updateVideoUrl = 'http://youtube.com/watch?v=sbcWY7t-JX8';
      const subscriber = MOCK_DATA.users.subscriber;
      const researchURL = `/research/${expected.slug}`;

      cy.signIn(subscriber.email, subscriber.password);

      cy.step("Can't add research with an incomplete profile");
      cy.visit('/research');
      cy.get('[data-cy=create-research]').should('not.exist');
      cy.get('[data-cy=complete-profile-research]').should('be.visible');
      cy.visit('/research/create');
      cy.url().should('contain', '/forbidden');

      cy.logout();
      cy.signIn(admin.email, admin.password);
      cy.step('Create the research article');
      cy.visit('/research');
      cy.get('[data-cy=loader]').should('not.exist');
      cy.get('[data-cy=create]:visible').click();

      cy.step('Warn if title is identical to an existing one');
      cy.contains('Start your Research');

      cy.step('Cannot be published when empty');
      cy.wait(1000);
      cy.get('[data-cy=submit]').click();
      cy.get('[data-cy=errors-container]').should('be.visible');

      cy.step('Warn if title not long enough');
      cy.get('[data-cy=intro-title').clear().type('Q').blur({ force: true });
      cy.contains(`Should be more than ${RESEARCH_TITLE_MIN_LENGTH} characters`);

      cy.step('Enter research article details');
      cy.get('[data-cy=intro-title').clear().type(initialTitle).blur();

      cy.step('Cannot be published without description');

      cy.get('[data-cy=intro-description]').type(expected.description).blur();

      cy.get('[data-cy=draft]').click();

      cy.get('[data-cy=draft-tag]').should('be.visible');
      cy.get('[data-cy=follow-button]').first().contains('Following');

      cy.step('Drafted Research should not appear on users profile');
      cy.visit('/u/' + admin.displayName);
      cy.get('[data-testid=research-stat]').should('not.exist');
      cy.get('[data-cy=ContribTab]').should('not.exist');

      cy.visit(`/research/${initialExpectedSlug}`);
      cy.get('[data-cy=edit]').click();
      cy.get('[data-cy=intro-title').clear().type(expected.title).blur();

      cy.step('Add image');
      cy.get('[data-cy=image-upload]')
        .find(':file')
        .selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });

      cy.step('New collaborators can be assigned to research');
      cy.selectTag(subscriber.username, '[data-cy=UserNameSelect]');

      cy.get('[data-cy=errors-container]').should('not.exist');
      cy.get('[data-cy=submit]').click();

      cy.url().should('include', researchURL);
      cy.visit(researchURL);

      cy.step('Research article displays correctly');
      cy.contains(expected.title);
      cy.contains(expected.description);
      cy.contains(admin.username);

      cy.step('Can access the research with the previous slug');
      cy.visit(`/research/${initialExpectedSlug}`);
      cy.contains(expected.title);

      cy.step('Published Research should appear on users profile');
      cy.visit('/u/' + admin.displayName);
      cy.get('[data-testid=research-stat]').should('exist');
      cy.get('[data-cy=ContribTab]').click();
      cy.get('[data-testid="research-contributions"]').should('be.visible');

      cy.step('New collaborators can add update');
      cy.logout();
      cy.signIn(subscriber.email, subscriber.password);
      cy.visit(`/research/${expected.slug}`);
      cy.get('[data-cy=follow-button]').first().contains('Following');
      cy.visit(`/research/${expected.slug}/new-update`);
      cy.contains('New update');

      cy.step('Cannot be published when empty');
      cy.wait(1000);
      cy.get('[data-cy=submit]').click();
      cy.get('[data-cy=errors-container]').should('be.visible');

      cy.step('Enter update details');
      cy.get('[data-cy=intro-title]')
        .wait(0)
        .focus()
        .clear()
        .type(updateTitle)
        .blur({ force: true });

      cy.get('[data-cy=intro-description]').clear().type(updateDescription).blur({ force: true });

      cy.get('[data-cy=videoUrl]').clear().type(updateVideoUrl).blur({ force: true });

      cy.step('Add file to update');
      cy.get('[data-cy=file-input-field]').click();
      cy.get('.uppy-Dashboard-input:first').as('file-input');
      cy.get('@file-input').selectFile('src/fixtures/files/Example.pdf', {
        force: true,
      });
      cy.get('.uppy-StatusBar-actionBtn--upload').as('upload-button');
      cy.get('@upload-button').click();

      cy.step('Published when fields are populated correctly');
      cy.get('[data-cy=submit]').click();

      cy.url().should('contain', `${researchURL}#update_`);
      cy.contains(updateTitle).should('be.visible');
      cy.contains(updateDescription).should('be.visible');
      cy.get('[data-cy="HideDiscussionContainer:button"]').last().click();
      cy.get('[data-cy="CollapsableCommentSection"]')
        .last()
        .within(() => {
          cy.get('[data-cy=follow-button]').contains('Following');
        });

      cy.step('Collaborator is subscribed to research and research update discussion');
      cy.logout();
      cy.signIn(subscriber.email, subscriber.password);
      cy.visit(researchURL);
      cy.get('[data-cy=follow-button]').first().contains('Following');
      cy.get('[data-cy="HideDiscussionContainer:button"]').last().click();
      cy.get('[data-cy=follow-button]').last().contains('Following');

      cy.step('Notification generated for update');
      cy.logout();
      cy.signIn(admin.email, admin.password);
      cy.expectNewNotification({
        content: updateTitle,
        path: `${researchURL}#update_`,
        title: expected.title,
        username: subscriber.username,
      });

      // cy.get('[data-cy=file-download-counter]').should(
      //   'have.text',
      //   '0 downloads',
      // )

      // cy.step('Download counter increments')
      // cy.wait(1000)
      // cy.get('[data-cy=downloadButton]').click()
      // cy.get('[data-cy=DonationRequestSkip]')
      //   .invoke('removeAttr', 'target')
      //   .click()
      // cy.go('back')

      // Currently too-flaky, commenting it out.
      //
      // cy.reload()
      // cy.get('[data-cy=file-download-counter]').should(
      //   'have.text',
      //   '1 download',
      // )

      // cy.step('Download count is preserved when replacing file')
      // cy.get('[data-cy=edit-update]').click()
      // cy.get('[data-cy=delete-file]').click()
      // cy.get('[data-cy=file-input-field]').click()
      // cy.get('.uppy-Dashboard-input:first').as('file-input')
      // cy.get('@file-input').selectFile('src/fixtures/files/Example.pdf', {
      //   force: true,
      // })
      // cy.get('.uppy-StatusBar-actionBtn--upload').as('upload-button')
      // cy.get('@upload-button').click()

      // cy.get('[data-cy=errors-container]').should('not.exist')
      // cy.get('[data-cy=submit]').click()

      // cy.step('Open the research update')
      // cy.get('[data-cy=file-download-counter]').should(
      //   'have.text',
      //   '1 download',
      // )
    });

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating a research item');
      cy.visit('/research');
      cy.get('[data-cy=create]').should('not.exist');
      cy.get('[data-cy=sign-up]').should('be.visible');

      cy.visit('/research/create');
      cy.url().should('contain', '/sign-in');
    });
  });

  describe('[Edit a research article]', () => {
    const editResearchUrl = '/research/create-research-article-test/edit';

    it('[By Anonymous]', () => {
      cy.step('Prevent anonymous access to edit research article');
      cy.visit(editResearchUrl);
      cy.url().should('contain', '/sign-in');
    });
  });

  describe('[Displays draft updates for Author]', () => {
    it('[By Authenticated]', () => {
      const randomId = generateAlphaNumeric(8).toLowerCase();
      const updateTitle = `${randomId} Create a research update`;
      const updateDescription = 'This is the description for the update.';
      const updateVideoUrl = 'http://youtube.com/watch?v=sbcWY7t-JX8';
      const researchItem = {
        category: 'Machines',
        description: 'After creating, the research will be deleted.',
        title: `${randomId} Create research article test`,
        slug: `${randomId}-create-research-article-test`,
      };
      const finalUpdateTitle = `Publish title: ${randomId}`;
      const researchURL = `/research/${researchItem.slug}`;
      cy.get('[data-cy="sign-up"]');
      cy.signIn(researcher.email, researcher.password);

      cy.step('Create the research article');
      cy.visit('/research');
      cy.get('[data-cy=loader]').should('not.exist');
      cy.get('a[href="/research/create"]').should('be.visible');
      cy.get('[data-cy=create]:visible').click();

      cy.step('Enter research article details');
      cy.get('[data-cy=intro-title').clear().type(researchItem.title).blur();
      cy.get('[data-cy=intro-description]').clear().type(researchItem.description);
      cy.selectTag(researchItem.category, '[data-cy=category-select]');
      cy.get('[data-cy=image-upload]')
        .find(':file')
        .selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
      cy.wait(2000);
      cy.get('[data-cy=submit]').click();
      cy.wait(2000);
      cy.get('[data-cy=follow-button]').contains('Following');
      cy.contains(researchItem.title);

      cy.step('Users can follow for research updates (for later expectations)');
      cy.logout();
      cy.signIn(admin.email, admin.password);
      cy.visit(researchURL);
      cy.get('[data-cy=follow-button]').first().click();
      cy.clearNotifications();
      cy.logout();

      cy.step('Can start adding research update');

      cy.signIn(researcher.email, researcher.password);
      cy.visit(researchURL);
      cy.get('[data-cy=addResearchUpdateButton]').click();
      cy.fillIntroTitle(updateTitle);

      cy.get('[data-cy=intro-description]').wait(0).focus().clear().type(updateDescription).blur();

      cy.get('[data-cy=videoUrl]').clear().type(updateVideoUrl).blur();

      cy.step('Save as Draft');
      cy.get('[data-cy=draft]').click();

      cy.step('Can see Draft after refresh');
      cy.contains(updateTitle);
      cy.get('[data-cy=DraftUpdateLabel]').should('be.visible');

      cy.step('Draft not visible to others');
      cy.logout();
      cy.visit(researchURL);
      cy.get(updateTitle).should('not.exist');
      cy.get('[data-cy=DraftUpdateLabel]').should('not.exist');

      cy.step("Draft hasn't generated notifications");
      cy.signIn(admin.email, admin.password);
      cy.expectNoNewNotification();
      cy.logout();

      cy.step('Draft updates can be published');
      cy.signIn(researcher.email, researcher.password);
      cy.visit(researchURL);
      cy.wait(2000);
      cy.get('[data-cy=edit-update]').click();
      cy.contains('Edit your update');
      cy.wait(1000);
      cy.fillIntroTitle(finalUpdateTitle);
      cy.get('[data-cy=submit]').click();
      cy.contains(finalUpdateTitle);
      cy.get('[data-cy=DraftUpdateLabel]').should('not.exist');

      cy.step('All ready for a discussion');
      cy.get('[data-cy="HideDiscussionContainer:button"]').click();
      cy.get('[data-cy=DiscussionTitle]').contains('Start the discussion');
      cy.get('[data-cy=follow-button]').contains('Following');

      cy.step('Now published draft has generated notifications');
      cy.logout();
      cy.signIn(admin.email, admin.password);
      cy.expectNewNotification({
        content: finalUpdateTitle,
        path: `${researchURL}#update_`,
        title: researchItem.title,
        username: researcher.username,
      });
    });

    it('[Can delete research article]', () => {
      const randomId = generateAlphaNumeric(8).toLowerCase();
      const deleteTitle = `${randomId} Research to delete`;
      const deleteExpectedSlug = `${randomId}-research-to-delete`;
      const deleteDescription = 'This research will be deleted.';

      cy.signIn(researcher.email, researcher.password);

      cy.step('Create a research article to delete');
      cy.visit('/research');
      cy.get('[data-cy=loader]').should('not.exist');
      cy.get('[data-cy=create]:visible').click();
      cy.get('[data-cy=intro-title').clear().type(deleteTitle).blur();
      cy.get('[data-cy=intro-description]').clear().type(deleteDescription);
      cy.selectTag('Machines', '[data-cy=category-select]');
      cy.get('[data-cy=image-upload]')
        .find(':file')
        .selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
      cy.wait(2000);
      cy.get('[data-cy=submit]').click();
      cy.wait(2000);
      cy.url().should('include', `/research/${deleteExpectedSlug}`);
      cy.contains(deleteTitle);

      cy.step('Delete button should be visible in edit mode');
      cy.get('[data-cy=edit]').click();
      cy.wait(1000);
      cy.get('[data-cy=delete]').should('be.visible');
      cy.get('[data-cy=delete]').should('contain', 'Delete this research');

      cy.step('Delete button should not be visible in create mode');
      cy.visit('/research/create');
      cy.get('[data-cy=delete]').should('not.exist');

      cy.step('Clicking delete shows confirmation modal');
      cy.visit(`/research/${deleteExpectedSlug}/edit`);
      cy.wait(1000);
      cy.get('[data-cy=delete]').click();
      cy.get('[data-cy="Confirm.modal: Modal"]').should('be.visible');
      cy.contains('Are you sure you want to delete this research?');
      cy.get('[data-cy="Confirm.modal: Cancel"]').should('be.visible');
      cy.get('[data-cy="Confirm.modal: Confirm"]').should('be.visible');

      cy.step('Canceling delete keeps the research');
      cy.get('[data-cy="Confirm.modal: Cancel"]').click();
      cy.get('[data-cy="Confirm.modal: Modal"]').should('not.exist');
      cy.url().should('include', `/research/${deleteExpectedSlug}/edit`);
      cy.visit(`/research/${deleteExpectedSlug}`);
      cy.contains(deleteTitle);

      cy.step('Confirming delete redirects to research list');
      cy.get('[data-cy=edit]').click();
      cy.wait(1000);
      cy.get('[data-cy=delete]').click();
      cy.get('[data-cy="Confirm.modal: Confirm"]').click();
      cy.wait(2000);
      cy.url().should('include', '/research');
      cy.url().should('not.include', deleteExpectedSlug);
      cy.contains(deleteTitle).should('not.exist');
    });

    it('[Can delete research update]', () => {
      const randomId = generateAlphaNumeric(8).toLowerCase();
      const researchItem = {
        title: `${randomId} Research for update delete test`,
        slug: `${randomId}-research-for-update-delete-test`,
        description: 'Research to test update deletion.',
      };
      const updateTitle = `${randomId} Update to delete`;
      const updateDescription = 'This update will be deleted.';
      const researchURL = `/research/${researchItem.slug}`;

      cy.signIn(researcher.email, researcher.password);

      cy.step('Create a research article with an update');
      cy.visit('/research');
      cy.get('[data-cy=loader]').should('not.exist');
      cy.get('[data-cy=create]:visible').click();
      cy.get('[data-cy=intro-title').clear().type(researchItem.title).blur();
      cy.get('[data-cy=intro-description]').clear().type(researchItem.description);
      cy.selectTag('Machines', '[data-cy=category-select]');
      cy.get('[data-cy=image-upload]')
        .find(':file')
        .selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
      cy.wait(2000);
      cy.get('[data-cy=submit]').click();
      cy.wait(2000);
      cy.url().should('include', researchURL);

      cy.step('Create an update');
      cy.get('[data-cy=addResearchUpdateButton]').click();
      cy.fillIntroTitle(updateTitle);
      cy.get('[data-cy=intro-description]').clear().type(updateDescription).blur();
      cy.get('[data-cy=submit]').click();
      cy.wait(2000);
      cy.contains(updateTitle);

      cy.step('Delete button should be visible when editing update');
      cy.get('[data-cy=edit-update]').click();
      cy.wait(1000);
      cy.get('[data-cy=delete]').should('be.visible');
      cy.get('[data-cy=delete]').should('contain', 'Delete this update');

      cy.step('Delete button should not be visible when creating new update');
      cy.visit(`${researchURL}/new-update`);
      cy.get('[data-cy=delete]').should('not.exist');

      cy.step('Clicking delete shows confirmation modal');
      cy.visit(researchURL);
      cy.get('[data-cy=edit-update]').click();
      cy.wait(1000);
      cy.get('[data-cy=delete]').click();
      cy.get('[data-cy="Confirm.modal: Modal"]').should('be.visible');
      cy.contains('Are you sure you want to delete this update?');
      cy.get('[data-cy="Confirm.modal: Cancel"]').should('be.visible');
      cy.get('[data-cy="Confirm.modal: Confirm"]').should('be.visible');

      cy.step('Canceling delete keeps the update');
      cy.get('[data-cy="Confirm.modal: Cancel"]').click();
      cy.get('[data-cy="Confirm.modal: Modal"]').should('not.exist');
      cy.visit(researchURL);
      cy.contains(updateTitle);

      cy.step('Confirming delete removes the update and redirects to research');
      cy.get('[data-cy=edit-update]').click();
      cy.wait(1000);
      cy.get('[data-cy=delete]').click();
      cy.get('[data-cy="Confirm.modal: Confirm"]').click();
      cy.wait(2000);
      cy.url().should('include', researchURL);
      cy.contains(updateTitle).should('not.exist');
      cy.contains(researchItem.title);
    });

    // it('[By Admin]', () => {
    // Should check an admin can edit other's content
    // })
  });
});
