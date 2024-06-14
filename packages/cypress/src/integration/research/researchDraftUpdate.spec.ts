import {
  generateNewUserDetails,
} from '../../utils/TestUtils'


const researcherEmail = 'research_creator@test.com'
const researcherPassword = 'research_creator'

describe('[Research]', () => {
  beforeEach(() => {
    cy.visit('/research')
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

      const newCollaborator = generateNewUserDetails()
      cy.signUpNewUser(newCollaborator)
      cy.logout()
      cy.login(researcherEmail, researcherPassword)

      cy.step('Create the research article')
      cy.visit('/research')
      cy.get('[data-cy=loader]').should('not.exist')
      cy.get('[data-cy=create]').click()

      cy.step('Enter research article details')

      cy.get('[data-cy=intro-title')
        .clear()
        .type(expected.title)
        .blur()
      cy.get('[data-cy=intro-description]')
        .clear()
        .type(expected.description)
      cy.get('[data-cy=submit]').click()

      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 }).click()

      cy.url().should('include', `/research/${expected.slug}`)
      cy.visit(`/research/${expected.slug}`)

      cy.step('Research article displays correctly')
      cy.contains(expected.title)
      cy.contains(expected.description)

      cy.get('[data-cy=addResearchUpdateButton]').click()

      cy.step('Enter update details')
      cy.get('[data-cy=intro-title]')
        .clear()
        .type(updateTitle)
        .blur()

      cy.get('[data-cy=intro-description]')
        .clear()
        .type(updateDescription)
        .blur()

      cy.get('[data-cy=videoUrl]')
        .clear()
        .type(updateVideoUrl)
        .blur()

      cy.step('Save as Draft')
      cy.get('[data-cy=draft]').click()

      cy.step('Can see Draft after refresh')
      cy.visit(`/research/${expected.slug}`)

      cy.contains(updateTitle)
    })
  })
})
