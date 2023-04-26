describe('[Research]', () => {
  beforeEach(() => {
    cy.visit('/research/qwerty')
  })

  describe('[Open comments]', () => {
    it('using UI elements', () => {
      cy.get('[data-cy="ResearchComments: button open-comments"]')
        .first()
        .click()
      cy.get('[data-cy="comment"]').should('have.length.gte', 1)
      cy.get('[data-cy="comment-submit"]').should('be.disabled')
    })

    it('using URL', () => {
      cy.visit('/research/qwerty#update-12-comment:abc123')
      cy.get('[data-cy="comment"]').should('have.length.gte', 1)
      cy.get('[data-cy="comment"]').scrollIntoView().should('be.inViewport', 10)
    })
  })

  describe('[By Authenticated]', () => {
    it('has active comment button for logged in user', () => {
      cy.login('howto_creator@test.com', 'test1234')
      cy.visit('/research/qwerty')
      cy.get('[data-cy="ResearchComments: button open-comments"]')
        .first()
        .click()
      cy.get('[data-cy="comments-form"]').type('An example comment')
      cy.get('[data-cy="comment-submit"]').should('not.be.disabled')
    })

    it('allows logged in user to post a commment', () => {
      cy.login('howto_creator@test.com', 'test1234')
      cy.visit('/research/qwerty')
      cy.get('[data-cy="ResearchComments: button open-comments"]')
        .first()
        .click()
      cy.get('[data-cy="comments-form"]').type('An example comment')
      cy.get('[data-cy="comment-submit"]').click()

      cy.get('[data-cy="comment"]').should('have.length.gte', 2)
      cy.get('[data-cy="comment"]')
        .last()
        .should('contain', 'An example comment')
    })

    it('allows comment author to edit', () => {
      cy.login('howto_creator@test.com', 'test1234')
      cy.visit('/research/qwerty')
      cy.get('[data-cy="ResearchComments: button open-comments"]')
        .first()
        .click()
      cy.get('[data-cy="comment"]').should('have.length.gte', 2)
      cy.get('[data-cy="comment"]')
        .last()
        .get(`[data-cy="CommentItem: edit button"]`)
        .should('exist')
    })

    it('allows comment author to delete', () => {
      cy.login('howto_creator@test.com', 'test1234')
      cy.visit('/research/qwerty')
      cy.get('[data-cy="ResearchComments: button open-comments"]')
        .first()
        .click()
      cy.get('[data-cy="comment"]').should('have.length.gte', 2)
      cy.get('[data-cy="comment"]')
        .last()
        .get(`[data-cy="CommentItem: delete button"]`)
        .click()
      cy.get('[data-cy="Confirm.modal: Confirm"]').should('exist')
    })
  })
})
