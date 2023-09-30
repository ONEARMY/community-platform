import { faker } from '@faker-js/faker'
import {
  HOWTO_STEP_DESCRIPTION_MAX_LENGTH,
  HOWTO_TITLE_MIN_LENGTH,
} from '../../../../../src/pages/Howto/constants'
import { headings, guidance } from '../../../../../src/pages/Howto/labels'
const creatorEmail = 'howto_creator@test.com'
const creatorPassword = 'test1234'

describe('[How To]', () => {
  beforeEach(() => {
    cy.visit('/how-to')
  })
  type Category = 'brainstorm' | 'exhibition' | 'product'
  type Duration = '<1 week' | '1-2 weeks' | '3-4 weeks'
  type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Very Hard'

  const selectCategory = (category: Category) => {
    cy.selectTag(category, '[data-cy=category-select]')
  }
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

  describe('[Create a how-to]', () => {
    const expected = {
      _createdBy: 'howto_creator',
      _deleted: false,
      category: 'Moulds',
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
          _animationKey: 'unique3',
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
          text: faker.lorem
            .sentences(50)
            .slice(0, HOWTO_STEP_DESCRIPTION_MAX_LENGTH)
            .trim(),
          title: 'A long title that is the total characters limit of',
        },
        {
          _animationKey: 'unique2',
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
      const categoryGuidanceMain = guidance.moulds.main.slice(0, 40)
      const categoryGuidanceFiles = guidance.moulds.files

      cy.login(creatorEmail, creatorPassword)
      cy.wait(2000)
      cy.step('Access the create-how-to')
      cy.get('[data-cy=create]').click()
      cy.contains('Create a How-To').should('exist')

      cy.step('Warn if title is identical with the existing ones')
      cy.get('[data-cy=intro-title]')
        .type('Make glass-like beams')
        .blur({ force: true })
      cy.contains(
        "Did you know there is an existing how-to with the title 'Make glass-like beams'? Using a unique title helps readers decide which how-to better meet their needs.",
      ).should('exist')

      cy.step('Warn if title is identical with a previously existing one')
      cy.get('[data-cy=intro-title]')
        .clear()
        .type('Make glassy beams')
        .blur({ force: true })
      cy.contains(
        "Did you know there is an existing how-to with the title 'Make glassy beams'? Using a unique title helps readers decide which how-to better meet their needs.",
      ).should('exist')

      cy.step('Warn if title has less than minimum required characters')
      cy.get('[data-cy=intro-title]').clear().type('qwer').blur({ force: true })
      cy.contains(
        `Should be more than ${HOWTO_TITLE_MIN_LENGTH} characters`,
      ).should('exist')

      cy.step('Cannot be published yet')
      cy.get('[data-cy=submit]').click()
      cy.get('[data-cy=errors-container]').should('be.visible')
      cy.contains(headings.errors).should('exist')
      cy.contains('Make sure this field is filled correctly').should('exist')

      cy.step('A basic draft was created')
      cy.get('[data-cy=intro-title]')
        .clear()
        .type('qwerty')
        .blur({ force: true })
      cy.get('[data-cy=draft]').click()
      cy.get('[data-cy=view-howto]:enabled', { timeout: 20000 })
        .click()
        .url()
        .should('include', `/how-to/qwerty`)
      cy.get('[data-cy=moderationstatus-draft]').should('exist')

      cy.step('Back to completing the how-to')
      cy.get('[data-cy=edit]').click()

      checkWhitespaceTrim('intro-title')

      cy.step('Fill up the intro')
      cy.get('[data-cy=intro-title').clear().type(title).blur({ force: true })
      cy.selectTag('howto_testing')

      cy.step('Select a category and see further guidance')
      cy.contains(categoryGuidanceMain).should('not.exist')
      cy.contains(categoryGuidanceFiles).should('not.exist')
      selectCategory(category as Category)
      cy.contains(categoryGuidanceMain).should('exist')
      cy.contains(categoryGuidanceFiles).should('exist')

      selectTimeDuration(time as Duration)
      selectDifficultLevel(difficulty_level as Difficulty)

      checkWhitespaceTrim('intro-description')

      cy.get('[data-cy=intro-description]').type(description)
      cy.get('[data-cy=fileLink]').type(fileLink)
      cy.step('Upload a cover for the intro')
      cy.get('[data-cy=intro-cover]')
        .find(':file')
        .attachFile('images/howto-intro.jpg')

      fillStep(1, steps[0].title, steps[0].text, imagePaths)

      fillStep(2, steps[2].title, steps[2].text, [], steps[2].videoURL)

      cy.step('Move step two down to step three')
      cy.get(`[data-cy=step_${1}]:visible`)
        .find('[data-cy=move-step-down]')
        .click()

      fillStep(2, steps[1].title, steps[1].text, imagePaths)

      cy.step('Add extra step')
      cy.get('[data-cy=add-step]').click()
      cy.wait(2000)

      deleteStep(4)
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
        .should('include', `/how-to/${slug}`)

      cy.step('Howto was created correctly')
      cy.get('[data-cy=file-download-counter]')
        .contains(total_downloads)
        .should('exist')
      cy.queryDocuments('howtos', 'title', '==', title).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqHowto', expected)
      })
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
      category: 'exhibition',
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
      cy.get('[data-cy=BlockedRoute]').should('be.exist')
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
        'Did you know there is an existing how-to with the title',
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
        "Did you know there is an existing how-to with the title 'Make glass-like beams'? Using a unique title helps readers decide which how-to better meet their needs.",
      ).should('exist')

      cy.step('Update the intro')
      cy.get('[data-cy=intro-title]').clear().type(expected.title)
      cy.selectTag('howto_testing')
      selectCategory(expected.category as Category)
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
