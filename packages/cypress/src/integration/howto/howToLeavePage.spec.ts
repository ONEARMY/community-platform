import { faker } from '@faker-js/faker'
import { DifficultyLevel, IModerationStatus } from 'oa-shared'

import { HOWTO_STEP_DESCRIPTION_MAX_LENGTH } from '../../../../../src/pages/Howto/constants'

const creatorEmail = 'howto_creator@test.com'
const creatorPassword = 'test1234'

describe('[How To]', () => {
  beforeEach(() => {
    cy.visit('/how-to')
  })

  describe('[Create a how-to]', () => {
    const expected = {
      _createdBy: 'howto_creator',
      _deleted: false,
      category: 'Moulds',
      description: 'After creating, the how-to will be deleted',
      moderation: IModerationStatus.AWAITING_MODERATION,
      difficulty_level: DifficultyLevel.MEDIUM,
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

    it('[Warning on leaving page]', () => {
      const stub = cy.stub()
      stub.returns(false)
      cy.on('window:confirm', stub)

      cy.login(creatorEmail, creatorPassword)
      cy.get('[data-cy=loader]').should('not.exist')
      cy.step('Access the create-how-to')
      cy.get('[data-cy=create]').click()
      cy.get('[data-cy=intro-title]')
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
      cy.get('[data-cy=intro-title]').clear().blur({ force: true })
      cy.get('[data-cy=page-link][href*="/how-to"]')
        .click()
        .then(() => {
          expect(stub.callCount).to.equal(0)
          stub.resetHistory()
        })
      cy.url().should('match', /\/how-to?/)
    })
  })
})
