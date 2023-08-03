import { faker } from '@faker-js/faker'
import {
  HOWTO_STEP_DESCRIPTION_MIN_LENGTH,
  HOWTO_STEP_DESCRIPTION_MAX_LENGTH,
  HOWTO_TITLE_MIN_LENGTH,
} from '../../../../../src/pages/Howto/constants'
const creatorEmail = 'howto_creator@test.com'
const creatorPassword = 'test1234'

describe('[How To]', () => {
  beforeEach(() => {
    cy.visit('/how-to')
  })
  type Duration = '<1 week' | '1-2 weeks' | '3-4 weeks'
  type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Very Hard'

  const selectTimeDuration = (duration: Duration) => {
    cy.selectTag(duration, '[data-cy=time-select]')
  }
  const selectDifficultLevel = (difficultLevel: Difficulty) => {
    cy.selectTag(difficultLevel, '[data-cy=difficulty-select]')
  }

  const fillStep = (
    stepNumber: number,
    title: string,
    description: string,
    images: string[],
    videoUrl?: string,
  ) => {
    const stepIndex = stepNumber - 1

    cy.step(`Filling step ${stepNumber}`)
    cy.get(`[data-cy=step_${stepIndex}]:visible`).within(($step) => {
      cy.get('[data-cy=step-title]').clear().type(`Step ${stepNumber} is easy`)

      if (stepIndex === 0) {
        cy.get('[data-cy=step-description]')
          .clear()
          .type(`description for step ${stepNumber}`)
          .blur({ force: true })

        cy.wrap($step).should(
          'contain',
          `Should be more than ${HOWTO_STEP_DESCRIPTION_MIN_LENGTH} characters`,
        )

        cy.get('[data-cy=step-description]')
          .clear()
          .invoke(
            'val',
            faker.lorem
              .sentences(50)
              .slice(0, HOWTO_STEP_DESCRIPTION_MAX_LENGTH + 1),
          )
          .blur({ force: true })

        cy.wrap($step).should('contain', `${HOWTO_STEP_DESCRIPTION_MAX_LENGTH}`)
      }

      cy.get('[data-cy=step-description]')
        .clear()
        .type(
          `Description for step ${stepNumber}. This description should be between the minimum and maximum description length`,
        )
        .blur({ force: true })

      cy.get('[data-cy=step-description]').should('have.value', description)
      cy.get('[data-cy=character-count]')
        .should('be.visible')
        .contains(`101 / ${HOWTO_STEP_DESCRIPTION_MAX_LENGTH}`)

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
          cy.get(`[data-cy=step-image-${index}]`)
            .find(':file')
            .attachFile(image)
        })
      }
    })
  }

  const deleteStep = (stepNumber: number) => {
    const stepIndex = stepNumber - 1
    cy.step(`Deleting step [${stepNumber}]`)
    cy.get(`[data-cy=step_${stepIndex}]:visible`)
      .find('[data-cy=delete-step]')
      .click()
    cy.get('[data-cy=confirm]').click()
  }

  describe('[Create a how-to]', () => {
    const expected = {
      _createdBy: 'howto_creator',
      _deleted: false,
      description: 'After creating, the how-to will be deleted',
      difficulty_level: 'Medium',
      time: '1-2 weeks',
      title: 'Create a how-to test',
      slug: 'create-a-how-to-test',
      previousSlugs: ['create-a-how-to-test'],
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
          _animationKey: 'unique1',
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
          _animationKey: 'unique2',
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
          text: 'Description for step 2. This description should be between the minimum and maximum description length',
          title: 'Step 2 is easy',
        },
        {
          _animationKey: 'unique3',
          images: [],
          text: 'Description for step 3. This description should be between the minimum and maximum description length',
          title: 'Step 3 is easy',
        },
      ],
    }

    it('[By Authenticated]', () => {
      cy.login(creatorEmail, creatorPassword)
      cy.wait(2000)
      cy.step('Access the create-how-to')
      cy.get('[data-cy=create]').click()
      cy.step('Warn if title is identical with the existing ones')
      cy.get('[data-cy=intro-title]')
        .type('Make glass-like beams')
        .blur({ force: true })
      cy.contains(
        'Titles must be unique, please try being more specific',
      ).should('exist')

      cy.step('Warn if title has less than minimum required characters')
      cy.get('[data-cy=intro-title]').clear().type('qwer').blur({ force: true })
      cy.contains(
        `Should be more than ${HOWTO_TITLE_MIN_LENGTH} characters`,
      ).should('exist')

      cy.step('Cannot be published yet')
      cy.get('[data-cy=submit]').click()
      cy.contains('Make sure this field is filled correctly').should('exist')

      cy.step('A basic draft was created')
      cy.get('[data-cy=draft]').click()
      cy.get('[data-cy=view-howto]:enabled', { timeout: 20000 })
        .click()
        .url()
        .should('include', `/how-to/qwer`)
      cy.get('[data-cy=moderationstatus-draft]').should('exist')

      cy.step('Back to completing the how-to')
      cy.get('[data-cy=edit]').click()

      cy.step('Fill up the intro')
      cy.get('[data-cy=intro-title')
        .clear()
        .type(expected.title)
        .blur({ force: true })
      cy.selectTag('howto_testing')
      selectTimeDuration(expected.time as Duration)
      selectDifficultLevel(expected.difficulty_level as Difficulty)

      cy.get('[data-cy=intro-description]').type(expected.description)
      cy.get('[data-cy=fileLink]').type(expected.fileLink)
      cy.step('Upload a cover for the intro')
      cy.get('[data-cy=intro-cover]')
        .find(':file')
        .attachFile('images/howto-intro.jpg')

      expected.steps.forEach((step, i) => {
        const videoUrl =
          i === 2 ? 'https://www.youtube.com/watch?v=Os7dREQ00l4' : undefined
        fillStep(
          i + 1,
          step.title,
          step.text,
          ['images/howto-step-pic1.jpg', 'images/howto-step-pic2.jpg'],
          videoUrl,
        )
      })

      cy.wait(2000)

      cy.screenClick()

      cy.step('A full draft was saved')
      cy.get('[data-cy=draft]').click()
      cy.get('[data-cy=view-howto]:enabled', { timeout: 20000 }).click()

      cy.step('A full draft can be submitted for review')
      cy.get('[data-cy=edit]').click()

      cy.get('[data-cy=submit]').click()
      cy.get('[data-cy=view-howto]:enabled', { timeout: 20000 })
        .click()
        .url()
        .should('include', `/how-to/${expected.slug}`)

      cy.step('Howto was created correctly')
      cy.get('[data-cy=file-download-counter]')
        .contains(expected.total_downloads)
        .should('exist')
      cy.queryDocuments('howtos', 'title', '==', expected.title).then(
        (docs) => {
          cy.log('queryDocs', docs)
          expect(docs.length).to.equal(1)
          cy.wrap(null)
            .then(() => docs[0])
            .should('eqHowto', expected)
        },
      )
    })

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating an how-to')
      cy.visit('/how-to/create')
      cy.get('div').contains('Please login to access this page')
    })

    it('[Warning on leaving page]', () => {
      const stub = cy.stub()
      stub.returns(false)
      cy.on('window:confirm', stub)

      cy.login(creatorEmail, creatorPassword)
      cy.wait(2000)
      cy.step('Access the create-how-to')
      cy.get('[data-cy=create]').click()
      cy.get('[data-cy=intro-title')
        .clear()
        .type(expected.title)
        .blur({ force: true })
      cy.get('[data-cy=page-link][href*="/how-to"]')
        .click()
        .then(() => {
          expect(stub.callCount).to.equal(1)
          stub.resetHistory()
        })
      cy.url().should('match', /\/how-to\/create$/)

      cy.step('Clear title input')
      cy.get('[data-cy=intro-title').clear().blur({ force: true })
      cy.get('[data-cy=page-link][href*="/how-to"]')
        .click()
        .then(() => {
          expect(stub.callCount).to.equal(0)
          stub.resetHistory()
        })
      cy.url().should('match', /\/how-to$/)
    })
  })

  describe('[Edit a how-to]', () => {
    const howtoUrl = '/how-to/set-up-devsite-to-help-coding'
    const editHowtoUrl = '/how-to/set-up-devsite-to-help-coding/edit'
    const expected = {
      _createdBy: 'howto_editor',
      _deleted: false,
      description: 'After editing, all changes are reverted',
      difficulty_level: 'Hard',
      files: [],
      fileLink: 'http://google.com/',
      total_downloads: 10,
      slug: 'this-is-an-edit-test',
      previousSlugs: ['set-up-devsite-to-help-coding', 'this-is-an-edit-test'],
      tags: { EOVeOZaKKw1UJkDIf3c3: true },
      time: '3-4 weeks',
      title: 'This is an edit test',
      cover_image: {
        contentType: 'image/jpeg',
        name: 'howto-intro.jpg',
        size: 19897,
        type: 'image/jpeg',
      },
      steps: [
        {
          _animationKey: 'unique1',
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
          _animationKey: 'unique2',
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
          text: 'Description for step 2. This description should be between the minimum and maximum description length',
          title: 'Step 2 is easy',
        },
        {
          _animationKey: 'unique3',
          images: [
            {
              contentType: 'image/jpeg',
              name: '3.1.jpg',
              size: 141803,
              type: 'image/jpeg',
            },
            {
              contentType: 'image/jpeg',
              name: '3.2.jpg',
              size: 211619,
              type: 'image/jpeg',
            },
            {
              contentType: 'image/jpeg',
              name: '3.4.jpg',
              size: 71309,
              type: 'image/jpeg',
            },
          ],
          text: 'Description for step 3. This description should be between the minimum and maximum description length',
          title: 'Step 3 is easy',
        },
      ],
    }

    it('[By Anonymous]', () => {
      cy.step('Prevent anonymous access to edit howto')
      cy.visit(editHowtoUrl)
      cy.get('[data-cy=auth-route-deny]').should('be.exist')
    })

    it('[By Authenticated]', () => {
      cy.step('Prevent non-owner access to edit howto')
      cy.visit('/how-to')
      cy.login(creatorEmail, creatorPassword)
      cy.visit(editHowtoUrl)
      // user should be redirect to how-to page
      cy.location('pathname').should('eq', howtoUrl)
    })

    it('[By Owner]', () => {
      cy.login('howto_editor@test.com', 'test1234')

      cy.step('Go to Edit mode')
      cy.visit(howtoUrl)
      cy.get('[data-cy=edit]').click()

      cy.step('Warn if title is identical with the existing ones')
      cy.get('[data-cy=intro-title]').focus().blur({ force: true })
      cy.wait(1000)
      cy.contains(
        'Titles must be unique, please try being more specific',
      ).should('not.exist')

      cy.step('Warn if title has less than minimum required characters')
      cy.get('[data-cy=intro-title]').clear().type('qwer').blur({ force: true })
      cy.contains(
        `Should be more than ${HOWTO_TITLE_MIN_LENGTH} characters`,
      ).should('exist')

      cy.get('[data-cy=intro-title]')
        .clear()
        .type('Make glass-like beams')
        .blur({ force: true })
      cy.contains(
        'Titles must be unique, please try being more specific',
      ).should('exist')

      cy.step('Update the intro')
      cy.get('[data-cy=intro-title]').clear().type(expected.title)
      cy.selectTag('howto_testing')
      selectTimeDuration(expected.time as Duration)
      selectDifficultLevel(expected.difficulty_level as Difficulty)
      cy.get('[data-cy=intro-description]').clear().type(expected.description)

      cy.step('Update a new cover for the intro')

      cy.get('[data-cy="intro-cover"]')
        .find('[data-cy="delete-image"]')
        .click({ force: true })

      cy.get('[data-cy="intro-cover"]')
        .find(':file')
        .attachFile('images/howto-intro.jpg')

      cy.step('Upload a new file')

      cy.get('[data-cy="files"]').click({ force: true })

      cy.fixture('files/Example.pdf').then((fileContent) => {
        cy.get('[data-cy="uppy-dashboard"] .uppy-Dashboard-input').attachFile({
          fileContent: fileContent,
          fileName: 'example.pdf',
          mimeType: 'application/pdf',
        })
      })

      cy.contains('Upload 1 file').click()

      cy.step('Steps beyond the minimum can be deleted')
      deleteStep(5)
      deleteStep(4)
      cy.wait(1000)

      expected.steps.forEach((step, index) => {
        fillStep(index + 1, step.title, step.text, [
          'images/howto-step-pic1.jpg',
          'images/howto-step-pic2.jpg',
        ])
      })

      cy.step('Submit updated Howto')

      cy.get('[data-cy=submit]').click()
      cy.get('[data-cy=invalid-file-warning]').should('be.visible')

      cy.get('[data-cy=fileLink]').clear()
      cy.get('[data-cy=submit]').click()
      cy.get('[data-cy=invalid-file-warning]').should('not.exist')

      cy.step('Open the updated how-to')

      cy.get('[data-cy=view-howto]:enabled', { timeout: 20000 })
        .click()
        .url()
        .should('include', '/how-to/this-is-an-edit-test')
      cy.get('[data-cy=how-to-basis]').contains('This is an edit test')
      cy.get('[data-cy=file-download-counter]')
        .contains(expected.total_downloads)
        .should('exist')
      cy.queryDocuments('howtos', 'title', '==', 'This is an edit test').then(
        (docs) => {
          cy.log('queryDocs', docs)
          expect(docs.length).to.equal(1)
          cy.wrap(null)
            .then(() => docs[0])
            .should('eqHowto', expected)
        },
      )

      cy.step('Open the old slug')

      cy.visit('/how-to/set-up-devsite-to-help-coding')
      cy.get('[data-cy=how-to-basis]').contains('This is an edit test')
    })
  })
})
