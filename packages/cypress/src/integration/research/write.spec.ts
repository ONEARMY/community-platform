import { faker } from '@faker-js/faker'

import { RESEARCH_TITLE_MIN_LENGTH } from '../../../../../src/pages/Research/constants'
import {
  generateNewUserDetails,
  setIsPreciousPlastic,
} from '../../utils/TestUtils'

import type { UserMenuItem } from '../../support/commandsUi'

const researcherEmail = 'research_creator@test.com'
const researcherPassword = 'research_creator'

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

      const newCollaborator = generateNewUserDetails()
      cy.signUpNewUser(newCollaborator)
      cy.logout()

      cy.step('Create the research article')
      cy.login(researcherEmail, researcherPassword)
      cy.visit('/research')
      cy.get('[data-cy=loader]').should('not.exist')
      cy.get('a[href="/research/create"]').should('exist')
      cy.get('[data-cy=create]').click()

      cy.step('Warn if title is identical to an existing one')
      cy.contains('Start your Research')
      cy.get('[data-cy=intro-title]').type('qwerty').blur({ force: true })
      cy.contains(
        'Titles must be unique, please try being more specific',
      ).should('be.visible')

      cy.step('Warn if title not long enough')
      cy.get('[data-cy=intro-title').clear().type('Q').blur({ force: true })
      cy.contains(`Should be more than ${RESEARCH_TITLE_MIN_LENGTH} characters`)

      cy.step('Enter research article details')
      cy.get('[data-cy=intro-title').clear().type(expected.title).blur()

      cy.step('Cannot be published without description')
      cy.get('[data-cy=submit]').click()
      cy.contains('Make sure this field is filled correctly').should(
        'be.visible',
      )
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Draft is saved without description')
      cy.get('[data-cy=draft]').click()

      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 })
        .click()
        .url()
      cy.get('[data-cy=moderationstatus-draft]').should('be.visible')
      cy.get('[data-cy=edit]').click()

      cy.wait(500) // wierd issue where description is cleared during typing below (causes first few characters to not be typed, thus failing the test)
      cy.get('[data-cy=intro-description]').type(expected.description).blur()

      cy.step('New collaborators can be assigned to research')
      cy.selectTag(newCollaborator.username, '[data-cy=UserNameSelect]')

      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.get('[data-cy=submit]').click()

      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 }).click()

      cy.url().should('include', `/research/${expected.slug}`)
      cy.visit(`/research/${expected.slug}`)

      cy.step('Research article displays correctly')
      cy.contains(expected.title)
      cy.contains(expected.description)
      cy.contains(newCollaborator.username)

      cy.step('New collaborators can add update')
      cy.clickMenuItem('Logout' as UserMenuItem)
      cy.login(newCollaborator.email, newCollaborator.password)
      cy.visit(`/research/${expected.slug}/edit`)
      cy.get('[data-cy=create-update]').click()
      cy.contains('New update')

      cy.step('Cannot be published when empty')
      cy.get('[data-cy=submit]').click()
      cy.contains('Make sure this field is filled correctly').should('exist')
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Enter update details')
      cy.get('[data-cy=intro-title]')
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

      cy.step('Published when fields are populated correctly')
      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.get('[data-cy=submit]').click()

      cy.step('Open the research update')
      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 })
        .click()
        .url()

      cy.contains(updateTitle).should('exist')
      cy.contains(updateDescription).should('exist')
    })

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating a research item')
      cy.visit('/research/create')
      cy.get('div').contains('role required to access this page')
    })

    it('[Any PP user]', () => {
      const title = 'PP plastic stuff'
      const expectSlug = 'pp-plastic-stuff'
      const description = 'Bespoke research topic'

      const updateTitle = 'First wonderful update'
      const updateDescription =
        'Update. One. Ready to start with the observations.'
      const updateVideoUrl = 'https://www.youtube.com/watch?v=U3mrj84p3cM'

      setIsPreciousPlastic()
      cy.logout()
      cy.signUpNewUser()

      cy.step('Can access create form')
      cy.visit('/research')
      cy.get('[data-cy=loader]').should('not.exist')
      cy.get('[data-cy=create]').should('be.visible')
      cy.get('a[href="/research/create"]').should('exist')

      cy.step('Enter research article details')
      cy.visit('/research/create')
      cy.get('[data-cy=intro-title').clear().type(title).blur({ force: true })

      cy.get('[data-cy=intro-description]')
        .clear({ force: true })
        .type(description)

      cy.get('[data-cy=submit]').click()

      cy.step('Publishes as expected')
      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 })
        .click()
        .url()
        .should('include', `/research/${expectSlug}`)

      cy.contains(title).should('be.visible')
      cy.contains(description).should('be.visible')

      cy.step('Can add update')
      cy.get('[data-cy=addResearchUpdateButton]').click()
      cy.get('[data-cy=intro-title]')
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

      cy.step('Update is published')
      cy.get('[data-cy=submit]').click()

      cy.step('Open the research update')
      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 })
        .click()
        .url()

      cy.contains(updateTitle).should('be.visible')
      cy.contains(updateDescription).should('be.visible')
    })

    it('[Warning on leaving page]', () => {
      const stub = cy.stub()
      stub.returns(false)
      cy.on('window:confirm', stub)

      cy.login(researcherEmail, researcherPassword)
      cy.step('Access the create research article')
      cy.get('[data-cy=loader]').should('not.exist')
      cy.get('a[href="/research/create"]').should('exist')
      cy.get('[data-cy=create]').click()
      cy.get('[data-cy=intro-title')
        .clear()
        .type('Create research article test')
        .blur({ force: true })
      cy.get('[data-cy=page-link][href*="/research"]')
        .click()
        .then(() => {
          expect(stub.callCount).to.equal(1)
          stub.resetHistory()
        })
      cy.url().should('match', /\/research\/create$/)

      cy.step('Clear title input')
      cy.get('[data-cy=intro-title').clear().blur({ force: true })
      cy.get('[data-cy=page-link][href*="/research"]')
        .click()
        .then(() => {
          expect(stub.callCount).to.equal(0)
          stub.resetHistory()
        })
      cy.url().should('match', /\/research?/)
    })
  })

  describe('[Edit a research article]', () => {
    const editResearchUrl = '/research/create-research-article-test/edit'

    it('[By Anonymous]', () => {
      cy.step('Prevent anonymous access to edit research article')
      cy.visit(editResearchUrl)
      cy.get('[data-cy=BlockedRoute]').should('be.visible')
    })
  })

  describe('[Displays draft updates for Author]', () => {
    const expected = {
      description: 'After creating, the research will be deleted.',
      title: 'Create research article test 2',
      slug: 'create-research-article-test-2',
    }

    it('[By Authenticated]', () => {
      const updateTitle = 'Create a research update 2'
      const updateDescription = 'This is the description for the update.'
      const updateVideoUrl = 'http://youtube.com/watch?v=sbcWY7t-JX8'

      cy.login(researcherEmail, researcherPassword)

      cy.step('Create the research article')
      cy.visit('/research')
      cy.get('[data-cy=loader]').should('not.exist')
      cy.get('a[href="/research/create"]').should('exist')
      cy.get('[data-cy=create]').click()

      cy.step('Enter research article details')

      cy.get('[data-cy=intro-title').clear().type(expected.title).blur()
      cy.get('[data-cy=intro-description]').clear().type(expected.description)
      cy.get('[data-cy=submit]').click()

      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 }).click()

      cy.url().should('include', `/research/${expected.slug}`)
      cy.visit(`/research/${expected.slug}`)

      cy.step('Research article displays correctly')
      cy.contains(expected.title)
      cy.contains(expected.description)

      cy.get('[data-cy=addResearchUpdateButton]').click()

      cy.step('Enter update details')
      cy.get('[data-cy=intro-title]').clear().type(updateTitle).blur()

      cy.get('[data-cy=intro-description]')
        .clear()
        .type(updateDescription)
        .blur()

      cy.get('[data-cy=videoUrl]').clear().type(updateVideoUrl).blur()

      cy.step('Save as Draft')
      cy.get('[data-cy=draft]').click()

      cy.step('Can see Draft after refresh')
      cy.contains('Uploading Update').should('exist')
      cy.get('[data-cy="icon-loading"]').should('not.exist')
      cy.visit(`/research/${expected.slug}`)

      cy.contains(updateTitle)
    })
  })
})
