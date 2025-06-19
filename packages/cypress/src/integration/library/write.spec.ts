import { faker } from '@faker-js/faker'
import { DifficultyLevelRecord, IModerationStatus } from 'oa-shared'

import { MOCK_DATA } from '../../data'
import { generateNewUserDetails } from '../../utils/TestUtils'

import type { DifficultyLevel } from 'oa-shared'

describe('[Library]', () => {
  beforeEach(() => {
    cy.visit('/library')
  })
  type Category = 'brainstorm' | 'exhibition' | 'product'
  type Duration = '<1 week' | '1-2 weeks' | '3-4 weeks'

  const selectCategory = (category: Category) => {
    cy.selectTag(category, '[data-cy=category-select]')
  }
  const selectTimeDuration = (duration: Duration) => {
    cy.selectTag(duration, '[data-cy=time-select]')
  }
  const selectDifficultLevel = (difficultLevel: DifficultyLevel) => {
    cy.selectTag(difficultLevel, '[data-cy=difficulty-select]')
  }

  const fillStep = (
    stepNumber: number,
    title: string,
    description: string,
    images: string[],
    videoUrl?: string,
  ) => {
    cy.step(`Filling step ${stepNumber}`)
    cy.get(`[data-cy=step_${stepNumber - 1}]`).should('be.visible')
    cy.get(`[data-cy=step_${stepNumber - 1}]`).within(($step) => {
      checkWhitespaceTrim('step-title')

      cy.get('[data-cy=step-title]')
        .clear()
        .invoke('val', title)
        .blur({ force: true })

      cy.get('[data-cy=step-title]').should('have.value', title)

      checkWhitespaceTrim('step-description')

      cy.get('[data-cy=step-description]')
        .clear()
        .invoke('val', description)
        .blur({ force: true })

      cy.get('[data-cy=step-description]').should('have.value', description)

      if (videoUrl) {
        cy.step('Adding Video Url')
        cy.get('[data-cy=step-videoUrl]').clear().type(videoUrl)
      } else {
        cy.step('Uploading pics')
        const hasExistingPics =
          Cypress.$($step).find('[data-cy=delete-step-img]').length > 0
        if (hasExistingPics) {
          cy.wrap($step)
            .find('[data-cy=delete-image]')
            .each(($deleteButton) => {
              cy.wrap($deleteButton).click()
            })
        }

        images.forEach((image, index) => {
          cy.get(`[data-cy=image-upload-${index}]`)
            .find(':file')
            .attachFile(image)
        })
      }
    })
  }

  const deleteStep = (stepNumber: number) => {
    const stepIndex = stepNumber - 1
    cy.step(`Deleting step [${stepNumber}]`)
    cy.get(`[data-cy=step_${stepIndex}]:visible`, { timeout: 20000 })
      .find('[data-cy=delete-step]')
      .click()
    cy.get('[data-cy=confirm]').click()
  }

  const checkWhitespaceTrim = (element: string) => {
    cy.step(`Check whitespace trim for [${element}]`)
    cy.get(`[data-cy=${element}]`)
      .clear()
      .invoke('val', '  Test for trailing whitespace  ')
      .blur()

    cy.get(`[data-cy=${element}]`).should(
      'have.value',
      'Test for trailing whitespace',
    )
    cy.get(`[data-cy=${element}]`).clear()
  }

  describe('[Create a project]', () => {
    const randomId = faker.random.alphaNumeric(8)
    const creator = MOCK_DATA.users.howto_creator

    const expected = {
      _createdBy: creator.userName,
      _deleted: false,
      category: 'Moulds',
      description: 'After creating, the project will be deleted',
      moderation: IModerationStatus.AWAITING_MODERATION,
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
    }

    it('[By Authenticated]', () => {
      const {
        category,
        description,
        difficulty_level,
        fileLink,
        slug,
        steps,
        time,
        title,
        total_downloads,
      } = expected
      const imagePaths = [
        'images/howto-step-pic1.jpg',
        'images/howto-step-pic2.jpg',
      ]
      const categoryGuidanceMain =
        'Cover image should show the fully built mould'

      cy.get('[data-cy="sign-up"]')
      cy.signIn(creator.email, creator.password)
      cy.get('[data-cy="MemberBadge-member"]').should('be.visible')
      cy.visit('/library')

      cy.step('Access the create project page')
      cy.get('a[href="/library/create"]').should('be.visible')
      cy.get('[data-cy=create-project]').click()
      cy.contains('Add your project').should('be.visible')

      cy.step('Warn if title has less than minimum required characters')
      cy.fillIntroTitle('qwer')
      cy.contains(`Should be more than ${5} characters`).should('be.visible')

      cy.step('Cannot be published yet')
      cy.get('[data-cy=submit]').should('be.disabled')

      cy.step('Warn if title is identical with the existing ones')
      cy.fillIntroTitle('Make glass-like beams')

      checkWhitespaceTrim('intro-description')
      cy.get('[data-cy=intro-description]').type(description)

      cy.get('[data-cy=draft]').click()

      cy.get('[data-cy=errors-container]').should('be.visible')
      cy.contains('Duplicate project').should('be.visible')

      cy.step('A basic draft is created')
      cy.fillIntroTitle(`qwerty ${randomId}`)

      cy.get('[data-cy=draft]').click()

      const firstSlug = `/library/qwerty-${randomId}`
      cy.url().should('include', firstSlug)
      cy.get('[data-cy=status-draft]').should('be.visible')

      cy.step('Back to completing the project')
      cy.get('[data-cy=edit]').click()

      checkWhitespaceTrim('intro-title')

      cy.step('Fill up the intro')
      cy.fillIntroTitle(title)
      cy.selectTag('howto_testing')

      cy.step('Select a category and see further guidance')
      cy.contains(categoryGuidanceMain).should('not.exist')
      selectCategory(category as Category)
      cy.contains(categoryGuidanceMain).should('be.visible')

      selectTimeDuration(time as Duration)
      selectDifficultLevel(difficulty_level as DifficultyLevel)

      cy.get('[data-cy=fileLink]').type(fileLink)
      cy.step('Upload a cover for the intro')
      cy.get('[data-cy="intro-cover"]')
        .find('input[type="file"]')
        .attachFile('images/howto-intro.jpg')

      fillStep(1, steps[0].title, steps[0].text, imagePaths)
      fillStep(2, steps[2].title, steps[2].text, [], steps[2].videoURL)

      cy.step('Move step two down to step three')
      cy.get(`[data-cy=step_${1}]:visible`)
        .find('[data-cy=move-step-down]')
        .click()
      fillStep(2, steps[1].title, steps[1].text, [], steps[1].videoURL)

      cy.step('Add extra step')
      cy.get('[data-cy=add-step]').click()

      cy.step('Can remove extra steps')
      deleteStep(4)
      cy.screenClick()

      cy.step('A full draft was saved')
      cy.get('[data-cy=draft]').click()

      cy.step('A full draft can be submitted for review')
      cy.get('[data-cy=edit]').click()

      cy.get('[data-cy=submit]').click()
      cy.url().should('include', `/library/${slug}`)

      cy.step('Project was created correctly')
      cy.get('[data-cy=file-download-counter]')
        .contains(total_downloads)
        .should('be.visible')
      // Check against UI
      cy.get('[data-cy=project-title]').should('contain', title)
      cy.get('[data-cy=project-description]').should('contain', description)

      // Check category
      cy.get('[data-cy=category]').should('contain', category)

      // Check difficulty level
      cy.get('[data-cy=difficulty-level]').should('contain', difficulty_level)

      // Check steps
      steps.forEach((step, index) => {
        cy.get(`[data-cy=step_${index + 1}]`)
          .find('[data-cy=step-title]')
          .should('contain', step.title)
        cy.get(`[data-cy=step_${index + 1}]`)
          .find('[data-cy=step-text]')
          .should('contain', step.text)
      })
    })

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating a project')
      cy.visit('/library')
      cy.get('[data-cy=create-project]').should('not.exist')
      cy.get('[data-cy=sign-up]').should('be.visible')

      cy.visit('/library/create')
      cy.url().should('contain', 'sign-in')
    })

    it('[By Incomplete Profile User]', () => {
      const user = generateNewUserDetails()
      cy.signUpNewUser(user)

      cy.step("Can't add to library")
      cy.visit('/library')
      cy.get('[data-cy=create-project]').should('not.exist')
      cy.get('[data-cy=complete-profile-project]').should('be.visible')

      cy.visit('/library/create')
      cy.get('[data-cy=incomplete-profile-message]').should('be.visible')
      cy.get('[data-cy=intro-title]').should('not.exist')
    })

    it('[Warning on leaving page]', () => {
      cy.signIn(creator.email, creator.password)
      cy.visit('/library')
      cy.get('[data-cy=loader]').should('not.exist')
      cy.step('Access the create project')
      cy.get('a[href="/library/create"]').should('be.visible')
      cy.get('[data-cy=create-project]').click()
      cy.fillIntroTitle(expected.title)
      cy.get('[data-cy=page-link][href*="/library"]').click()
      cy.get('[data-cy="Confirm.modal: Cancel"]').click()
      cy.url().should('match', /\/library\/create$/)

      cy.step('Clear title input')
      cy.get('[data-cy=intro-title]').clear().blur({ force: true })
      cy.get('[data-cy=page-link][href*="/library"]').click()
      cy.url().should('match', /\/library?/)
    })

    // it('[Admin]', () => {
    // Should check an admin can edit other's content
    // })
  })
})
