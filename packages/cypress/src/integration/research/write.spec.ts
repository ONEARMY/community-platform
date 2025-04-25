import { faker } from '@faker-js/faker'

import { RESEARCH_TITLE_MIN_LENGTH } from '../../../../../src/pages/Research/constants'
import { MOCK_DATA } from '../../data'
import { generateAlphaNumeric } from '../../utils/TestUtils'

const generateArticle = () => {
  const title = faker.lorem.words(4)
  const slug = title.toLowerCase().split(' ').join('-')

  return {
    _createdBy: 'research_creator',
    _deleted: false,
    description: 'After creating, the research will be deleted.',
    title: title,
    slug: slug,
    previousSlugs: [slug],
    status: 'In progress',
  }
}

const researcherEmail = MOCK_DATA.users.research_creator.email
const researcherPassword = MOCK_DATA.users.research_creator.password

describe('[Research]', () => {
  beforeEach(() => {
    cy.visit('/research')
  })

  describe('[Create research article]', () => {
    it('[By Authenticated]', () => {
      const expected = generateArticle()

      const updateTitle = faker.lorem.words(5)
      const updateDescription = 'This is the description for the update.'
      const updateVideoUrl = 'http://youtube.com/watch?v=sbcWY7t-JX8'
      const subscriber = MOCK_DATA.users.subscriber
      const admin = MOCK_DATA.users.admin

      cy.signIn(subscriber.email, subscriber.password)

      cy.step("Can't add research with an incomplete profile")
      cy.visit('/research')
      cy.get('[data-cy=create-research]').should('not.exist')
      cy.get('[data-cy=complete-profile-research]').should('be.visible')
      cy.visit('/research/create')
      cy.url().should('contain', '/forbidden')

      cy.logout()
      cy.signIn(admin.email, admin.password)
      cy.step('Create the research article')
      cy.visit('/research')
      cy.get('[data-cy=loader]').should('not.exist')
      cy.get('[data-cy=create]').click()

      cy.step('Warn if title is identical to an existing one')
      cy.contains('Start your Research')

      cy.step('Warn if title not long enough')
      cy.get('[data-cy=intro-title').clear().type('Q').blur({ force: true })
      cy.contains(`Should be more than ${RESEARCH_TITLE_MIN_LENGTH} characters`)

      cy.step('Enter research article details')
      cy.get('[data-cy=intro-title').clear().type(expected.title).blur()

      cy.step('Cannot be published without description')

      cy.get('[data-cy=intro-description]').type(expected.description).blur()

      cy.get('[data-cy=draft]').click()

      cy.get('[data-cy=research-draft]').should('be.visible')
      cy.get('[data-cy=edit]').click()

      cy.step('New collaborators can be assigned to research')
      cy.selectTag(subscriber.userName, '[data-cy=UserNameSelect]')

      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.get('[data-cy=submit]').click()

      cy.url().should('include', `/research/${expected.slug}`)
      cy.visit(`/research/${expected.slug}`)

      cy.step('Research article displays correctly')
      cy.contains(expected.title)
      cy.contains(expected.description)
      cy.contains(admin.userName)

      cy.step('New collaborators can add update')
      cy.logout()
      cy.signIn(subscriber.email, subscriber.password)
      cy.visit(`/research/${expected.slug}/edit`)
      cy.get('[data-cy=create-update]').click()
      cy.contains('New update')

      cy.step('Cannot be published when empty')
      cy.get('[data-cy=submit]').should('be.disabled')

      cy.step('Enter update details')
      cy.get('[data-cy=intro-title]')
        .wait(0)
        .focus()
        .clear()
        .type(updateTitle)
        .blur({ force: true })

      cy.get('[data-cy=intro-description]')
        .clear()
        .type(updateDescription)
        .blur({ force: true })

      cy.get('[data-cy=videoUrl]')
        .clear()
        .type(updateVideoUrl)
        .blur({ force: true })

      cy.step('Add file to update')
      cy.get('[data-cy=file-input-field]').click()
      cy.get('.uppy-Dashboard-input:first').as('file-input')
      cy.get('@file-input').selectFile('src/fixtures/files/Example.pdf', {
        force: true,
      })
      cy.get('.uppy-StatusBar-actionBtn--upload').as('upload-button')
      cy.get('@upload-button').click()

      cy.step('Published when fields are populated correctly')
      cy.get('[data-cy=submit]').click()

      cy.contains(updateTitle).should('be.visible')
      cy.contains(updateDescription).should('be.visible')
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
    })

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating a research item')
      cy.visit('/research')
      cy.get('[data-cy=create]').should('not.exist')
      cy.get('[data-cy=sign-up]').should('be.visible')

      cy.visit('/research/create')
      cy.url().should('contain', '/sign-in')
    })
  })

  describe('[Edit a research article]', () => {
    const editResearchUrl = '/research/create-research-article-test/edit'

    it('[By Anonymous]', () => {
      cy.step('Prevent anonymous access to edit research article')
      cy.visit(editResearchUrl)
      cy.url().should('contain', '/sign-in')
    })
  })

  describe('[Displays draft updates for Author]', () => {
    it('[By Authenticated]', () => {
      const randomId = generateAlphaNumeric(8).toLowerCase()
      const updateTitle = `${randomId} Create a research update`
      const updateDescription = 'This is the description for the update.'
      const updateVideoUrl = 'http://youtube.com/watch?v=sbcWY7t-JX8'
      const expected = {
        category: 'Machines',
        description: 'After creating, the research will be deleted.',
        title: `${randomId} Create research article test`,
        slug: `${randomId}-create-research-article-test`,
      }

      cy.get('[data-cy="sign-up"]')
      cy.signIn(researcherEmail, researcherPassword)

      cy.step('Create the research article')
      cy.visit('/research')
      cy.get('[data-cy=loader]').should('not.exist')
      cy.get('a[href="/research/create"]').should('be.visible')
      cy.get('[data-cy=create]').click()

      cy.step('Enter research article details')
      cy.get('[data-cy=intro-title').clear().type(expected.title).blur()
      cy.get('[data-cy=intro-description]').clear().type(expected.description)
      cy.selectTag(expected.category, '[data-cy=category-select]')
      cy.get('[data-cy=submit]').click()

      cy.url().should('include', `/research/${expected.slug}`)
      cy.visit(`/research/${expected.slug}`)

      cy.step('Research article displays correctly')
      cy.contains(expected.title)
      cy.contains(expected.description)
      cy.contains(expected.category)

      cy.get('[data-cy=addResearchUpdateButton]').click()

      cy.step('Enter update details')
      cy.fillIntroTitle(updateTitle)

      cy.get('[data-cy=intro-description]')
        .wait(0)
        .focus()
        .clear()
        .type(updateDescription)
        .blur()

      cy.get('[data-cy=videoUrl]').clear().type(updateVideoUrl).blur()

      cy.step('Save as Draft')
      cy.get('[data-cy=draft]').click()

      cy.step('Can see Draft after refresh')

      cy.contains(updateTitle)
      cy.get('[data-cy=DraftUpdateLabel]').should('be.visible')

      cy.step('Draft not visible to others')
      cy.logout()
      cy.visit(`/research/${expected.slug}`)
      cy.get(updateTitle).should('not.exist')
      cy.get('[data-cy=DraftUpdateLabel]').should('not.exist')

      cy.step('Draft updates can be published')
      cy.signIn(researcherEmail, researcherPassword)
      cy.visit(`/research/${expected.slug}`)
      cy.get('[data-cy=edit-update]').click()
      cy.contains('Edit your update')
      cy.wait(1000)
      cy.get('[data-cy=submit]').click()
      cy.contains(updateTitle)
      cy.get('[data-cy=DraftUpdateLabel]').should('not.exist')
    })

    // it('[By Admin]', () => {
    // Should check an admin can edit other's content
    // })
  })
})
