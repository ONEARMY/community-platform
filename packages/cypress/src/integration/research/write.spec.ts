import { faker } from '@faker-js/faker'
import {
  RESEARCH_TITLE_MIN_LENGTH,
  RESEARCH_MAX_LENGTH,
} from '../../../../../src/pages/Research/constants'

const researcherEmail = 'research_creator@test.com'
const researcherPassword = 'research_creator'

describe('[Research]', () => {
  beforeEach(() => {
    cy.visit('/research')
  })

  const expected = {
    _createdBy: 'research_creator',
    _deleted: false,
    description: 'After creating, the research will be deleted',
    title: 'Create research article test',
    slug: 'create-research-article-test',
    previousSlugs: ['create-research-article-test'],
  }

  describe('[Create research article]', () => {
    it('[By Authenticated]', () => {
      cy.login(researcherEmail, researcherPassword)
      cy.wait(2000)
      cy.step('Create the research article')
      cy.get('[data-cy=create]').click()
      cy.step('Warn if title is identical to an existing one')
      cy.get('[data-cy=intro-title]').type('qwerty').blur({ force: true })
      cy.contains(
        'Titles must be unique, please try being more specific',
      ).should('exist')

      cy.step('Warn if title not long enough')
      cy.get('[data-cy=intro-title').clear().type('Q').blur({ force: true })
      cy.contains(`Should be more than ${RESEARCH_TITLE_MIN_LENGTH} characters`)

      cy.step('Enter research article details')
      cy.get('[data-cy=intro-title')
        .clear()
        .type('Create research article test')
        .blur({ force: true })

      cy.step('Cannot be published without description')
      cy.get('[data-cy=submit]').click()
      cy.contains('Make sure this field is filled correctly').should('exist')
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Draft is saved without description')
      cy.get('[data-cy=draft]').click()
      cy.wait(2000)

      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 })
        .click()
        .url()
      cy.get('[data-cy=moderationstatus-draft]').should('exist')
      cy.get('[data-cy=edit]').click()

      cy.step('Limit description text to maximum length')
      cy.get('[data-cy=intro-description]')
        .clear({ force: true })
        // Speeds up test by avoiding typing and then updates character count by typing
        .invoke(
          'val',
          faker.lorem.sentences(50).slice(0, RESEARCH_MAX_LENGTH - 1),
        )
        .type('Reach maximum character count')
      cy.contains(`${RESEARCH_MAX_LENGTH} / ${RESEARCH_MAX_LENGTH}`)

      cy.get('[data-cy=intro-description]')
        .clear({ force: true })
        .type(expected.description)

      cy.screenClick()
      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.get('[data-cy=submit]').click()

      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 })
        .click()
        .url()
        .should('include', `/research/${expected.slug}`)

      cy.step('Research article was created correctly')
      cy.queryDocuments('research', 'title', '==', expected.title).then(
        (docs) => {
          cy.log('queryDocs', docs)
          expect(docs.length).to.equal(1)
          cy.wrap(null)
            .then(() => docs[0])
            .should('eqResearch', expected)
        },
      )
    })

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating a research item')
      cy.visit('/research/create')
      cy.get('div').contains('role required to access this page')
    })

    it('[Warning on leaving page]', () => {
      const stub = cy.stub()
      stub.returns(false)
      cy.on('window:confirm', stub)

      cy.login(researcherEmail, researcherPassword)
      cy.wait(2000)
      cy.step('Access the create research article')
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
      cy.url().should('match', /\/research$/)
    })
  })

  describe('[Edit a research article]', () => {
    const researchUrl = '/research/create-research-article-test'
    const editResearchUrl = '/research/create-research-article-test/edit'

    it('[By Anonymous]', () => {
      cy.step('Prevent anonymous access to edit research article')
      cy.visit(editResearchUrl)
      cy.get('[data-cy=BlockedRoute]').should('be.exist')
    })

    it('[By Authenticated]', () => {
      cy.step('Prevent non-owner access to edit research article')
      cy.visit('/research')
      cy.login('research_editor@test.com', 'research_editor')
      cy.visit(editResearchUrl)
      // user should be redirect to research page
      // cy.location('pathname').should('eq', researchUrl)
    })

    it('[By Owner]', () => {
      expected.title = `${expected.title} edited`
      expected.slug = `${expected.slug}-edited`
      expected.previousSlugs = [
        'create-research-article-test',
        'create-research-article-test-edited',
      ]
      cy.visit(researchUrl)
      cy.login(researcherEmail, researcherPassword)
      cy.step('Go to Edit mode')
      cy.get('[data-cy=edit]').click()

      cy.step('Update the intro')
      cy.get('[data-cy=intro-title]').clear().type(expected.title)

      cy.step('Enter research article details')
      cy.get('[data-cy="intro-description"]')
        .clear()
        .type(expected.description)
        .blur({ force: true })

      cy.get('[data-cy=submit]').click()

      cy.step('Open the updated research article')
      cy.wait(2000)
      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 })
        .click()
        .url()
        .should('include', `${researchUrl}-edited`)
      cy.get('[data-cy=research-basis]').contains(expected.title)

      cy.queryDocuments('research', 'title', '==', expected.title).then(
        (docs) => {
          cy.log('queryDocs', docs)
          expect(docs.length).to.equal(1)
          cy.wrap(null)
            .then(() => docs[0])
            .should('eqResearch', expected)
        },
      )

      cy.step('Open the old slug')

      cy.visit(researchUrl)
      cy.get('[data-cy=research-basis]').contains(expected.title)
    })
  })

  describe('[Add a research update]', () => {
    const researchUrl = '/research/create-research-article-test'
    const title = 'Create a research update'
    const description = 'This is the description for the update.'
    const videoUrl = 'http://youtube.com/watch?v=sbcWY7t-JX8'

    it('[By Owner]', () => {
      cy.visit(researchUrl)
      cy.login(researcherEmail, researcherPassword)

      cy.step('Go to add update')
      cy.get('[data-cy=edit]').click()
      cy.get('[data-cy=create-update]').click()

      cy.step('Cannot be published when empty')
      cy.get('[data-cy=submit]').click()
      cy.contains('Make sure this field is filled correctly').should('exist')
      cy.get('[data-cy=errors-container]').should('be.visible')

      cy.step('Enter update details')
      cy.get('[data-cy=intro-title]').clear().type(title).blur({ force: true })

      cy.get('[data-cy=intro-description]')
        .clear()
        .type(description)
        .blur({ force: true })

      cy.get('[data-cy=videoUrl]').clear().type(videoUrl).blur({ force: true })

      cy.step('Published when fields are populated correctly')
      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.get('[data-cy=submit]').click()

      cy.step('Open the research update')
      cy.wait(2000)
      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 })
        .click()
        .url()

      cy.contains(title).should('exist')
      cy.contains(description).should('exist')
    })
  })
})
