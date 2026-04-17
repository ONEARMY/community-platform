import { faker } from '@faker-js/faker';
import { DifficultyLevelRecord } from 'oa-shared';

import { MOCK_DATA } from '../../data';
import { generateAlphaNumeric, generateNewUserDetails, getTenantUser } from '../../utils/TestUtils';

import type { DifficultyLevel } from 'oa-shared';

let randomId;
const admin = getTenantUser(MOCK_DATA.users.admin);

describe('[Library]', () => {
  beforeEach(() => {
    cy.visit('/library');
    randomId = generateAlphaNumeric(8).toLowerCase();
  });
  type Category = 'brainstorm' | 'exhibition' | 'product';
  type Duration = '<1 week' | '1-2 weeks' | '3-4 weeks';

  const selectCategory = (category: Category) => {
    cy.selectTag(category, '[data-cy=category-select]');
  };
  const selectTimeDuration = (duration: Duration) => {
    cy.selectTag(duration, '[data-cy=time-select]');
  };
  const selectDifficultLevel = (difficultLevel: DifficultyLevel) => {
    cy.selectTag(difficultLevel, '[data-cy=difficulty-select]');
  };

  const fillStep = (stepNumber: number, title: string, description: string, images: string[], videoUrl?: string) => {
    cy.step(`Filling step ${stepNumber}`);
    cy.get(`[data-cy=step_${stepNumber - 1}]`).should('be.visible');
    cy.get(`[data-cy=step_${stepNumber - 1}]`).within(($step) => {
      checkWhitespaceTrim('step-title');

      cy.get('[data-cy=step-title]').clear().invoke('val', title).blur({ force: true });

      cy.get('[data-cy=step-title]').should('have.value', title);

      checkWhitespaceTrim('step-description');

      cy.get('[data-cy=step-description]').clear().invoke('val', description).blur({ force: true });

      cy.get('[data-cy=step-description]').should('have.value', description);

      if (videoUrl) {
        cy.step('Adding Video Url');
        cy.get('[data-cy=step-videoUrl]').clear().type(videoUrl);
      } else {
        cy.step('Uploading pics');
        const hasExistingPics = Cypress.$($step).find('[data-cy=delete-step-img]').length > 0;
        if (hasExistingPics) {
          cy.wrap($step)
            .find('[data-cy=delete-image]')
            .each(($deleteButton) => {
              cy.wrap($deleteButton).click();
            });
        }

        images.forEach((image, index) => {
          cy.get(`[data-cy=new-image-upload]`).find(':file').selectFile(image, { force: true });
        });
      }
    });
  };

  const deleteStep = (stepNumber: number) => {
    const stepIndex = stepNumber - 1;
    cy.step(`Deleting step [${stepNumber}]`);
    cy.get(`[data-cy=step_${stepIndex}]:visible`, { timeout: 20000 }).find('[data-cy=delete-step]').click();
    cy.get('[data-cy=confirm]').click();
  };

  const checkWhitespaceTrim = (element: string) => {
    cy.step(`Check whitespace trim for [${element}]`);
    cy.get(`[data-cy=${element}]`).clear().invoke('val', '  Test for trailing whitespace  ').blur();

    cy.get(`[data-cy=${element}]`).should('have.value', 'Test for trailing whitespace');
    cy.get(`[data-cy=${element}]`).clear();
  };

  describe('[Create a project]', () => {
    const creator = getTenantUser(MOCK_DATA.users.howto_creator);

    const expected = {
      _createdBy: creator.username,
      _deleted: false,
      category: 'Moulds',
      description: 'After creating, the project will be deleted',
      moderation: 'awaiting-moderation',
      difficulty_level: DifficultyLevelRecord.medium,
      time: '1-2 weeks',
      title: `Create a project test ${randomId}`,
      slug: `create-a-project-test-${randomId}`,
      previousSlugs: ['qwerty', `create-a-project-test-${randomId}`],
      fileLink: 'http://google.com/',
      files: [],
      total_downloads: 0,
      tags: {
        EOVeOZaKKw1UJkDIf3c3: true,
      },
      cover_image: {
        contentType: 'image/jpeg',
        name: 'howto-intro.jpg',
        size: 19897,
        type: 'image/jpeg',
      },
      steps: [
        {
          images: [
            {
              contentType: 'image/jpeg',
              name: 'howto-step-pic1.jpg',
              size: 19410,
              type: 'image/jpeg',
            },
            {
              contentType: 'image/jpeg',
              name: 'howto-step-pic2.jpg',
              size: 20009,
              type: 'image/jpeg',
            },
          ],
          text: 'Description for step 1. This description should be between the minimum and maximum description length',
          title: 'Step 1 is easy',
        },
        {
          text: faker.lorem.sentences(50).slice(0, 1000).trim(),
          title: 'A long title that is the total characters limit of',
          videoURL: 'https://www.youtube.com/watch?v=Os7dREQ00l4',
        },
        {
          images: [],
          text: 'Description for step 3. This description should be between the minimum and maximum description length',
          title: 'Step 3 is easy',
          videoURL: 'https://www.youtube.com/watch?v=Os7dREQ00l4',
        },
      ],
    };

    it('[By Authenticated]', () => {
      const { category, description, difficulty_level, fileLink, slug, steps, time, title, total_downloads } = expected;
      const imagePaths = ['src/fixtures/images/howto-step-pic1.jpg', 'src/fixtures/images/howto-step-pic2.jpg'];
      const categoryGuidanceMain = 'Cover image should show the fully built mould';

      cy.get('[data-cy="sign-up"]');
      cy.signIn(creator.email, creator.password);
      cy.get('[data-cy="MemberBadge-member"]').should('be.visible');
      cy.visit('/library');

      cy.step('Access the create project page');
      cy.get('a[href="/library/create"]').should('be.visible');
      cy.get('[data-cy=create-project]:visible').click();
      cy.contains('Add your project').should('be.visible');

      cy.step('Warn if title has less than minimum required characters');
      cy.fillIntroTitle('qwer');
      cy.contains(`Should be more than ${5} characters`).should('be.visible');

      cy.step('Cannot be published yet');
      cy.get('[data-cy=submit]').click();
      cy.get('[data-cy=errors-container]');

      cy.step('Warn if title is identical with the existing ones');
      cy.fillIntroTitle('Make glass-like beams');

      checkWhitespaceTrim('intro-description');
      cy.get('[data-cy=intro-description]').type(description);

      cy.get('[data-cy=draft]').click();

      cy.wait(1000);
      cy.contains('Error: A project with this name already exists').should('be.visible');

      cy.step('A basic draft is created');
      cy.fillIntroTitle(`qwerty ${randomId}`);

      cy.get('[data-cy=draft]').click();
      cy.contains('Draft saved!').should('be.visible');
      cy.wait(1000);
      cy.contains('View draft').should('be.visible').click();

      const firstSlug = `/library/qwerty-${randomId}`;
      cy.url().should('include', firstSlug);
      cy.contains('Draft');

      cy.step("Drafted project should not appear on user's profile");
      cy.visit('/u/' + creator.displayName);
      cy.get('[data-testid=library-stat]').should('not.exist');
      cy.get('[data-cy=ContribTab]').should('not.exist');

      cy.step('Back to completing the project');
      cy.visit(firstSlug);
      cy.get('[data-cy=edit]').click();
      checkWhitespaceTrim('intro-title');

      cy.step('Fill up the intro');
      cy.fillIntroTitle(title);
      cy.selectTag('howto_testing');

      cy.step('Select a category and see further guidance');
      cy.contains(categoryGuidanceMain).should('not.exist');
      selectCategory(category as Category);
      cy.contains(categoryGuidanceMain).should('be.visible');

      selectTimeDuration(time as Duration);
      selectDifficultLevel(difficulty_level as DifficultyLevel);

      cy.get('[data-cy=fileLink]').type(fileLink);
      cy.step('Upload a cover for the intro');
      cy.get('[data-cy="image-input"]').find('input[type="file"]').selectFile('src/fixtures/images/howto-intro.jpg', { force: true });
      cy.get('[data-cy="image-input"]').parent().find('[data-cy=delete-image]').should('exist');

      fillStep(1, steps[0].title, steps[0].text, imagePaths);
      fillStep(2, steps[2].title, steps[2].text, [], steps[2].videoURL);

      cy.step('Move step two down to step three');
      cy.get(`[data-cy=step_${1}]:visible`).find('[data-cy=move-step-down]').click();
      fillStep(2, steps[1].title, steps[1].text, [], steps[1].videoURL);

      cy.step('Add extra step');
      cy.get('[data-cy=add-step]').click();

      cy.step('Can remove extra steps');
      deleteStep(4);
      cy.screenClick();

      cy.step('A full draft was saved');
      cy.get('[data-cy=draft]').click();
      cy.get('[data-cy=errors-container]').should('not.exist');

      cy.step('A full draft can be submitted for review');
      cy.get('[data-cy=edit]').click();
      cy.get('[data-cy=errors-container]').should('not.exist');
      cy.get('[data-cy=submit]').click();

      cy.get('a[data-cy=toast-action-link]').should('contain', 'View project');
      cy.wait(1000);
      cy.get('a[data-cy=toast-action-link]').should('contain', 'View project').click();
      cy.url().should('include', `/library/${slug}`);

      cy.step('Project was created correctly');
      cy.get('[data-cy=file-download-counter]').contains(total_downloads).should('be.visible');
      cy.get('[data-cy=project-title]').should('contain', title);
      cy.get('[data-cy=project-description]').should('contain', description);
      cy.get('[data-cy=category]').should('contain', category);
      cy.get('[data-cy=difficulty-level]').should('contain', difficulty_level);

      cy.get('[data-cy=follow-button]').first().should('contain', 'Following Comments');

      steps.forEach((step, index) => {
        cy.get(`[data-cy=step_${index + 1}]`)
          .find('[data-cy=step-title]')
          .should('contain', step.title);
        cy.get(`[data-cy=step_${index + 1}]`)
          .find('[data-cy=step-text]')
          .should('contain', step.text);
      });

      cy.step('Can access the project with the previous slug');
      cy.visit(firstSlug);
      cy.contains(title);

      // Won't show on profile yet as project needs admin approval
      // cy.step('Published project should appear on users profile')
      // cy.visit('/u/' + creator.displayName)
      // cy.get('[data-testid=library-stat]').contains('1')
      // cy.get('[data-cy=ContribTab]').click()
      // cy.get('[data-cy="library-contributions"]').should('be.visible')
    });

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating a project');
      cy.visit('/library');
      cy.get('[data-cy=create-project]').should('not.exist');
      cy.get('[data-cy=sign-up]').should('be.visible');

      cy.visit('/library/create');
      cy.url().should('contain', 'sign-in');
    });

    it('[By Incomplete Profile User]', () => {
      const user = generateNewUserDetails();
      cy.signUpNewUser(user);

      cy.step("Can't add to library");
      cy.visit('/library');
      cy.get('[data-cy=create-project]').should('not.exist');
      cy.get('[data-cy=complete-profile-project]').should('be.visible');

      cy.visit('/library/create');
      cy.get('[data-cy=incomplete-profile-message]').should('be.visible');
      cy.get('[data-cy=intro-title]').should('not.exist');
    });

    it('[Warning on leaving page]', () => {
      cy.signIn(creator.email, creator.password);
      cy.visit('/library');
      cy.get('[data-cy=loader]').should('not.exist');
      cy.step('Access the create project');
      cy.get('a[href="/library/create"]').should('be.visible');
      cy.get('[data-cy=create-project]:visible').click();
      cy.fillIntroTitle(expected.title);
      cy.get('[data-cy=page-link][href*="/library"]').click();
      cy.get('[data-cy="Confirm.modal: Cancel"]').click();
      cy.url().should('match', /\/library\/create$/);

      cy.step('Clear title input');
      cy.get('[data-cy=intro-title]').clear().blur({ force: true });
      cy.get('[data-cy=page-link][href*="/library"]').click();
      cy.url().should('match', /\/library?/);
    });

    it('[Edit project - Replace images]', () => {
      const randomId = generateAlphaNumeric(8).toLowerCase();
      const initialTitle = `${randomId} Project for image edit`;
      const slug = `${randomId}-project-for-image-edit`;
      const updatedDescription = 'Updated with new images';
      const category = 'Moulds';
      const time = '1-2 weeks';
      const difficulty = 'Medium';

      cy.signIn(creator.email, creator.password);

      cy.step('Create a project with images');
      cy.visit('/library/create');
      cy.fillIntroTitle(initialTitle);
      cy.get('[data-cy=intro-description]').type('Initial description');
      selectCategory(category as Category);
      selectTimeDuration(time as Duration);
      selectDifficultLevel(difficulty as DifficultyLevel);

      cy.step('Upload cover image');
      cy.get('[data-cy="image-input"]').find('input[type="file"]').selectFile('src/fixtures/images/howto-intro.jpg', { force: true });
      cy.get('[data-cy="image-input"]').parent().find('[data-cy=delete-image]').should('exist');

      cy.step('Add step with images');
      cy.get('[data-cy=step_0]').within(() => {
        cy.get('[data-cy=step-title]').clear().type('Step with images').blur();
        cy.get('[data-cy=step-description]')
          .clear()
          .type('Description for step 2. This description should be between the minimum and maximum description length')
          .blur();
        cy.get('[data-cy=new-image-upload]').find(':file').selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
        cy.get('[data-cy=delete-image]').should('exist');
      });

      cy.get('[data-cy=step_1]').within(() => {
        cy.get('[data-cy=step-title]').clear().type('Second step').blur();
        cy.get('[data-cy=step-description]')
          .clear()
          .type('Description for step 2. This description should be between the minimum and maximum description length')
          .blur();
        cy.get('[data-cy=new-image-upload]').find(':file').selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
        cy.get('[data-cy=delete-image]').should('exist');
      });

      cy.get('[data-cy=step_2]').within(() => {
        cy.get('[data-cy=step-title]').clear().type('Third step').blur();
        cy.get('[data-cy=step-description]')
          .clear()
          .type('Description for step 3. This description should be between the minimum and maximum description length')
          .blur();
        cy.get('[data-cy=new-image-upload]').find(':file').selectFile('src/fixtures/images/howto-step-pic1.jpg', { force: true });
        cy.get('[data-cy=delete-image]').should('exist');
      });

      cy.get('[data-cy=submit]').click();

      cy.get('a[data-cy=toast-action-link]').should('contain', 'View project');
      cy.wait(1000);
      cy.get('a[data-cy=toast-action-link]').should('contain', 'View project').click();
      cy.url().should('include', `/library/${slug}`);

      cy.step('Edit project and replace images');
      cy.get('[data-cy=edit]').click();
      cy.get('[data-cy=intro-description]').clear().type(updatedDescription);

      cy.step('Replace cover image');
      cy.get('[data-cy="image-input"]').parent().find('[data-cy=delete-image]').click({ force: true });
      cy.get('[data-cy="image-input"]').find('input[type="file"]').selectFile('src/fixtures/images/howto-step-pic2.jpg', { force: true });
      cy.get('[data-cy="image-input"]').parent().find('[data-cy=delete-image]').should('exist');

      cy.step('Replace step image');
      cy.get('[data-cy=step_0]').within(() => {
        cy.get('[data-cy=delete-image]').first().click({ force: true });
        cy.get('[data-cy=new-image-upload]').find(':file').selectFile('src/fixtures/images/howto-step-pic2.jpg', { force: true });
        cy.get('[data-cy=delete-image]').should('exist');
      });

      cy.get('[data-cy=submit]').click();

      cy.get('a[data-cy=toast-action-link]').should('contain', 'View project');
      cy.wait(1000);
      cy.get('a[data-cy=toast-action-link]').should('contain', 'View project').click();
      cy.url().should('include', `/library/${slug}`);
      cy.contains(updatedDescription);
    });

    it('[Create and edit project with files]', () => {
      const randomId = generateAlphaNumeric(8).toLowerCase();
      const title = `${randomId} Project with files`;
      const slug = `${randomId}-project-with-files`;
      const category = 'Moulds';
      const time = '1-2 weeks';
      const difficulty = 'Medium';

      cy.signIn(creator.email, creator.password);

      cy.step('Create a project with file upload');
      cy.visit('/library/create');
      cy.fillIntroTitle(title);
      cy.get('[data-cy=intro-description]').type('Project with downloadable files');
      selectCategory(category as Category);
      selectTimeDuration(time as Duration);
      selectDifficultLevel(difficulty as DifficultyLevel);

      cy.get('[data-cy="image-input"]').find('input[type="file"]').selectFile('src/fixtures/images/howto-intro.jpg', { force: true });
      cy.get('[data-cy="image-input"]').parent().find('[data-cy=delete-image]').should('exist');

      cy.step('Upload a file');
      cy.get('[id=file-input]').selectFile('src/fixtures/files/Example.pdf', { force: true });
      cy.get('[data-cy=remove-file]').should('exist');

      cy.step('Add steps with video URLs');
      cy.get('[data-cy=step_0]').within(() => {
        cy.get('[data-cy=step-title]').clear().type('First step').blur();
        cy.get('[data-cy=step-description]')
          .clear()
          .type('Description for step 1. This description should be between the minimum and maximum description length')
          .blur();
        cy.get('[data-cy=step-videoUrl]').clear().type('https://www.youtube.com/watch?v=Os7dREQ00l4');
      });

      cy.get('[data-cy=step_1]').within(() => {
        cy.get('[data-cy=step-title]').clear().type('Second step').blur();
        cy.get('[data-cy=step-description]')
          .clear()
          .type('Description for step 2. This description should be between the minimum and maximum description length')
          .blur();
        cy.get('[data-cy=step-videoUrl]').clear().type('https://www.youtube.com/watch?v=Os7dREQ00l4');
      });

      cy.get('[data-cy=step_2]').within(() => {
        cy.get('[data-cy=step-title]').clear().type('Third step').blur();
        cy.get('[data-cy=step-description]')
          .clear()
          .type('Description for step 3. This description should be between the minimum and maximum description length')
          .blur();
        cy.get('[data-cy=step-videoUrl]').clear().type('https://www.youtube.com/watch?v=Os7dREQ00l4');
      });

      cy.get('[data-cy=submit]').click();
      cy.get('a[data-cy=toast-action-link]').should('contain', 'View project');
      cy.wait(1000);
      cy.get('a[data-cy=toast-action-link]').should('contain', 'View project').click();
      cy.url().should('include', `/library/${slug}`);
      cy.get('[data-cy=downloadButton]').should('be.visible');

      cy.step('Edit project and replace file');
      cy.get('[data-cy=edit]').click();

      cy.step('Remove old file and upload new one');
      cy.get('[data-cy=remove-file]').click();
      cy.get('[id=file-input]').selectFile('src/fixtures/files/Example.pdf', { force: true });
      cy.get('[data-cy=remove-file]').should('exist');

      cy.get('[data-cy=submit]').click();
      cy.get('a[data-cy=toast-action-link]').should('contain', 'View project');
      cy.wait(1000);
      cy.get('a[data-cy=toast-action-link]').should('contain', 'View project').click();
      cy.url().should('include', `/library/${slug}`);
      cy.get('[data-cy=downloadButton]').should('be.visible');
    });

    it('[Delete button is visible]', () => {
      cy.signIn(admin.email, admin.password);

      cy.visit('/library/qwerty/edit');

      cy.step('Delete button should be visible to project author');
      cy.get('[data-cy="Project: delete button"]').should('be.visible');
    });
  });
});
