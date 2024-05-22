describe('[How To Commenting]', () => {
  const specificHowtoUrl = '/how-to/make-an-interlocking-brick'

  describe('[By Everyone]', () => {
    it('[Comment requires login]', () => {
      cy.visit(specificHowtoUrl)
      cy.step(`Comment functionality prompts user to login`)
      cy.get(`[data-cy="comments-login-prompt"]`).should('be.exist')
      cy.get(`[data-cy="comments-form"]`).should('not.exist')
    })
  })

  describe('[By Authenticated]', () => {
    it('[Commenting]', () => {
      const commentText = 'A short string intended to test commenting'
      cy.signUpNewUser()

      cy.visit(specificHowtoUrl)

      cy.step("Cannot edit others' comments")
      cy.get('[data-cy="howto-comments"]').should('exist')
      cy.get('[data-cy="CommentItem: edit button"]').should('not.exist')

      cy.step('Can add comment')
      cy.contains('1 Comment')
      cy.get(`[data-cy="comments-login-prompt"]`).should('not.exist')
      cy.get(`[data-cy="comments-form"]`).should('be.exist')
      cy.get('[data-cy="comments-form"]').type(commentText)
      cy.get('[data-cy="comment-submit"]').click()
      cy.wait(1000)
      cy.contains('2 Comments')
      cy.get('[data-cy="comment-text"]').should('contain.text', commentText)

      cy.step('Can edit comment')
      cy.get('[data-cy="CommentItem: edit button"]').should('exist')
      // To-do: Actually add edit comment flow

      cy.step('Can edit comment')
      cy.get('[data-cy="comment-text"]')
        .get(`[data-cy="CommentItem: delete button"]`)
        .click()

      cy.get('[data-cy="Confirm.modal: Confirm"]').should('exist')
      // To-do: Actually delete comment flow
    })
  })
})
