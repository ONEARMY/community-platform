describe('[How To Commenting]', () => {
  const specificHowtoUrl = '/how-to/make-an-interlocking-brick'
  beforeEach(() => {
    cy.visit('/how-to')
  })

  describe('[By Everyone]', () => {
    it('[Comment requires login]', () => {
      cy.visit(specificHowtoUrl)
      cy.step(`Comment functionality prompts user to login`)
      cy.get(`[data-cy="comments-login-prompt"]`).should('be.exist')
      cy.get(`[data-cy="comments-form"]`).should('not.exist')
    })
  })

  describe('[By Authenticated]', () => {
    it('[Edit button is unavailable to non-resource owners]', () => {
      cy.login('howto_reader@test.com', 'test1234')
      cy.visit(specificHowtoUrl)
      cy.get('[data-cy=edit]').should('not.exist')
    })

    describe('[Commenting]', () => {
      it('[Logged in user cannot edit a comment by another user]', () => {
        cy.login('howto_reader@test.com', 'test1234')
        cy.visit(specificHowtoUrl)
        cy.get('[data-cy="howto-comments"]').should('exist')
        cy.get('[data-cy="CommentItem: edit button"]').should('not.exist')
      })

      it('[Logged in user can add a comment]', () => {
        const commentText = 'A short string intended to test commenting'
        cy.login('howto_reader@test.com', 'test1234')
        cy.visit(specificHowtoUrl)

        cy.get(`[data-cy="comments-login-prompt"]`).should('not.exist')

        cy.get(`[data-cy="comments-form"]`).should('be.exist')

        cy.get('[data-cy="comments-form"]').type(commentText)

        cy.get('[data-cy="comment-submit"]').click()

        cy.get('[data-cy="comment-text"]').should('contain.text', commentText)
      })

      it('[Logged in user can edit the comment they have added]', () => {
        cy.login('howto_reader@test.com', 'test1234')
        cy.visit(specificHowtoUrl)

        cy.get('[data-cy="CommentItem: edit button"]').should('exist')
      })

      it('[Allows comment author to delete]', () => {
        const commentText = 'A short string intended to test commenting'
        cy.login('howto_reader@test.com', 'test1234')
        cy.visit(specificHowtoUrl)

        cy.get(`[data-cy="comments-login-prompt"]`).should('not.exist')

        cy.get(`[data-cy="comments-form"]`).should('be.exist')

        cy.get('[data-cy="comments-form"]').type(commentText)

        cy.get('[data-cy="comment-submit"]').click()

        cy.get('[data-cy="comment-text"]').should('contain.text', commentText)

        cy.get('[data-cy="comment-text"]')
          .get(`[data-cy="CommentItem: delete button"]`)
          .click()

        cy.get('[data-cy="Confirm.modal: Confirm"]').should('exist')
      })
    })
  })
})
