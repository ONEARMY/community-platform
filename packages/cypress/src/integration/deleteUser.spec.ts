import {
  generateAlphaNumeric,
  generateNewUserDetails,
  supabaseAdminClient,
} from '../utils/TestUtils'

describe('Delete account flow', () => {
  let user

  beforeEach(() => {
    user = generateNewUserDetails()
    cy.signUpNewUser(user)
    cy.completeUserProfile(user.username)
    cy.visit('/settings/account')
  })

  describe('when I open the delete-account modal', () => {
    beforeEach(() => {
      cy.get('[data-cy=delete-account-modal-open-button]').click()
    })

    it('shows the confirmation dialog', () => {
      cy.get('[data-cy=delete-account-modal-container]').should('be.visible')
    })

    it('closes the dialog when I click cancel', () => {
      cy.get('[data-cy=delete-account-modal-cancel-button]').click()
      cy.get('[data-cy=delete-account-modal-container]').should('not.exist')
    })
  })

  describe('when I type an incorrect confirmation', () => {
    beforeEach(() => {
      cy.get('[data-cy=delete-account-modal-open-button]').click()
      cy.get('[data-cy=delete-account-modal-confirmation-input]').type('DELE')
    })

    it('keeps the confirm button disabled', () => {
      cy.get('[data-cy=delete-account-modal-confirm-button]').should(
        'be.disabled',
      )
    })
  })

  describe('when I type the exact "DELETE" confirmation', () => {
    beforeEach(() => {
      cy.get('[data-cy=delete-account-modal-open-button]').click()
      cy.get('[data-cy=delete-account-modal-confirmation-input]').type(
        'DELETE',
      )
    })

    it('enables and lets me delete my account', () => {
      cy.get('[data-cy=delete-account-modal-confirm-button]')
        .should('be.enabled')
        .click()

      cy.url().should('eq', Cypress.config('baseUrl') + '/')
    })
  })

  describe('when I’ve created a question before deleting', () => {
    const id = generateAlphaNumeric(8).toLowerCase()
    const slug = `${id}-health-cost-of-plastic`
    const comment = 'An interesting question.'

    beforeEach(() => {
      cy.visit('/questions/create')
      cy.get('[data-cy=field-title]')
        .clear()
        .type(`${id} Health cost of plastic?`)
      cy.get('[data-cy=field-description]').type('A very long question.')
      cy.get('[data-cy=submit]').click()

      cy.addComment(comment)

      deleteAccount()
    })

    it('removes the user assignment from the question', () => {
      cy.visit(`/questions/${slug}`)
      cy.get('[data-cy="Username"]').should('not.include.text', user.username)
    })

    it('removes the comment from the question', () => {
      cy.visit(`/questions/${slug}`)
      cy.get('[data-cy=comment-text]').should('not.exist')
    })
  })

  describe('when I’ve created a research before deleting', () => {
    const randomId = generateAlphaNumeric(8).toLowerCase()
    const slug = `${randomId}-create-research-article-test`

    beforeEach(() => {
      const adminClient = supabaseAdminClient()
      cy.wrap(
        adminClient
          .from('profiles')
          .update({ roles: ['admin'] })
          .eq('username', user.username),
      ).then(() => {
        cy.visit('/research/create')
        cy.get('[data-cy=intro-title').type(
          `${randomId} Create research article test`,
        )
        cy.get('[data-cy=intro-description]').type(
          'After creating, the research will be deleted.',
        )
        cy.get('[data-testid="image-input"]').attachFile(
          `images/profile-cover-1.jpg`,
          { force: true },
        )
        cy.get('[data-cy=submit]').click()

        deleteAccount()
      })
    })

    it('removes the user assignment from the research', () => {
      cy.wait(5000)
      cy.visit(`/research/${slug}`)
      cy.get('[data-cy=Username]').should('not.include.text', user.username)
    })
  })
})

const deleteAccount = () => {
  cy.visit('/settings/account')
  cy.get('[data-cy=delete-account-modal-open-button]').click()
  cy.get('[data-cy=delete-account-modal-confirmation-input]').type('DELETE')
  cy.get('[data-cy=delete-account-modal-confirm-button]').click()
  cy.wait(5000)
}