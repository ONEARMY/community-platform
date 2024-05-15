describe('[Research]', () => {
  beforeEach(() => {
    cy.visit('/research/qwerty')
  })

  describe('[Open comments]', () => {
    it('using UI elements', () => {
      cy.get('[data-cy="ResearchComments: button open-comments"]')
        .first()
        .contains('View 1 comment')
        .click()
      cy.get('[data-cy="comment"]').should('have.length.gte', 1)
      cy.get('[data-cy="comment-submit"]').should('be.disabled')
    })

    it('using URL', () => {
      cy.visit('/research/qwerty#update-0-comment:ZAB2SoUZtzUyeYLg9Cro')
      cy.get('[data-cy="comment"]').should('have.length.gte', 1)
      cy.get('[data-cy="comment"]').scrollIntoView().should('be.inViewport', 10)
    })
  })

  describe('[By Authenticated]', () => {
    it('allows logged in user to post a commment', () => {
      const comment = 'An example comment'
      const updatedComment = "I've updated my comment now"

      cy.login('research_creator@test.com', 'research_creator')
      cy.visit('/research/qwerty')

      cy.step('Can create and publish their own comment')
      cy.get('[data-cy="ResearchComments: button open-comments"]')
        .first()
        .click()
      cy.get('[data-cy="comments-form"]').type(comment)
      cy.get('[data-cy="comment-submit"]').click()

      cy.get('[data-cy="comment"]').should('have.length.gte', 2)
      cy.get('[data-cy="comment"]').last().should('contain', comment)

      cy.step('Can edit their own comment')
      cy.get('[data-cy="comment"]')
        .last()
        .get(`[data-cy="CommentItem: edit button"]`)
        .click()

      cy.get('[data-cy=edit-comment]').clear().type(updatedComment)
      cy.get('[data-cy=edit-comment-submit]').click()

      cy.contains(updatedComment)
      cy.contains(comment).should('not.exist')

      cy.step('Can delete their own comment')
      cy.get('[data-cy="CommentItem: delete button"]:first').click()
      cy.get('[data-cy="Confirm.modal: Confirm"]:first').click()
      cy.contains(updatedComment).should('not.exist')
    })
  })
})
