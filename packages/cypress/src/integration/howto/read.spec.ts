import { v4 as uuid } from 'uuid'

describe('[How To]', () => {
  const SKIP_TIMEOUT = { timeout: 300 }
  const totalHowTo = 8

  describe('[List how-tos]', () => {
    const howtoUrl = '/how-to/make-glass-like-beams'
    const coverFileRegex = /howto-beams-glass-0-3.jpg/
    beforeEach(() => {
      cy.visit('/how-to')
    })
    it('[By Everyone]', () => {
      cy.step('More How-tos button is hidden')
      cy.get('[data-cy=more-how-tos]', SKIP_TIMEOUT).should('be.hidden')

      cy.step('All how-tos are shown')

      cy.get('[data-cy=card]').its('length').should('be.eq', totalHowTo)

      cy.step('How-to cards has basic info')
      cy.get(`[data-cy=card] a[href="${howtoUrl}"]`).within(() => {
        cy.contains('Make glass-like beams').should('be.exist')
        cy.contains('howto_creator').should('be.exist')
        cy.get('img').should('have.attr', 'src').and('match', coverFileRegex)
        cy.contains('extrusion').should('be.exist')
      })

      cy.step(`Open how-to details when click on a how-to ${howtoUrl}`)
      cy.get(`[data-cy=card] a[href="${howtoUrl}"]`, SKIP_TIMEOUT).click()
      cy.url().should('include', howtoUrl)
    })

    it('[By Authenticated]', () => {
      cy.login('howto_reader@test.com', 'test1234')
      cy.step('Create button is available')
      cy.get('[data-cy=create]').click().url()
    })
  })

  describe('[Filter by Category]', () => {
    beforeEach(() => {
      cy.visit('/how-to')
    })
    it('[By Everyone]', () => {
      cy.step('Select a category')
      cy.selectTag('product', '[data-cy="category-select"]')
      cy.get('[data-cy=card]').its('length').should('be.eq', 3)

      cy.step('Type and select a category')
      cy.selectTag('injection', '[data-cy="category-select"]')

      cy.get('[data-cy=card]').its('length').should('be.eq', 2)

      cy.step('Remove all category filter')
      cy.get('.data-cy__clear-indicator').click()
      cy.get('.data-cy__multi-value__label').should('not.exist')
      cy.get('[data-cy=card]').its('length').should('be.eq', totalHowTo)
    })
  })

  describe('[Read a How-to]', () => {
    const specificHowtoUrl = '/how-to/make-an-interlocking-brick'
    const coverFileRegex = /brick-12-1.jpg/
    beforeEach(() => {
      cy.visit('/how-to')
    })
    describe('[By Everyone]', () => {
      it('[See all info]', () => {
        cy.visit(specificHowtoUrl)
        cy.step('Edit button is not available')
        cy.get('[data-cy=edit]').should('not.exist')

        cy.step('How-to has basic info')
        cy.get('[data-cy=how-to-basis]').then(($summary) => {
          expect($summary).to.contain('howto_creator', 'Author')
          expect($summary).to.contain('Last edit on', 'Edit')
          expect($summary).to.contain('Make an interlocking brick', 'Title')
          expect($summary).to.contain(
            'show you how to make a brick using the injection machine',
            'Description',
          )
          expect($summary).to.contain('12 steps', 'No. of Steps')
          expect($summary).to.contain('3-4 weeks', 'Duration')
          expect($summary).to.contain('Hard', 'Difficulty')
          expect($summary).to.contain('product', 'Tag')
          expect($summary).to.contain('injection', 'Tag')
          expect($summary).to.contain('moul', 'Tag')
          expect($summary.find('img[alt="how-to cover"]'))
            .to.have.attr('src')
            .match(coverFileRegex)
        })

        cy.step('Attachments are opened in new tabs')
        cy.get(`a[href*="art%20final%201.skp"]`).should(
          'have.attr',
          'target',
          '_blank',
        )
        cy.get(`a[href*="art%20final%202.skp"]`).should(
          'have.attr',
          'target',
          '_blank',
        )

        cy.step('All steps are shown')
        cy.get('[data-cy^=step_]').should('have.length', 12)

        cy.step('All step info is shown')
        cy.get('[data-cy=step_11]').within(($step) => {
          const pic1Regex = /brick-12-1.jpg/
          const pic3Regex = /brick-12.jpg/
          expect($step).to.contain('12', 'Step #')
          expect($step).to.contain('Explore the possibilities!', 'Title')
          expect($step).to.contain(
            `more for a partition or the wall`,
            'Description',
          )
          cy.step('Step image is updated on thumbnail click')
          cy.get('[data-cy="active-image"]')
            .should('have.attr', 'src')
            .and('match', pic1Regex)
          cy.get('[data-cy=thumbnail]:eq(2)').click()
          cy.get('[data-cy="active-image"]')
            .should('have.attr', 'src')
            .and('match', pic3Regex)
        })

        cy.step(`Comment functionality prompts user to login`)
        cy.get(`[data-cy="comments-login-prompt"]`).should('be.exist')

        cy.step('Video embed exists')
        cy.get('[data-cy="video-embed"]').within(() => {
          cy.get('iframe').should('have.attr', 'src').and('include', 'youtube')
        })
        // This fails in firefox due to cross security, simply check url
        // .should(iframe => expect(iframe.contents().find('video')).to.exist)
        cy.step('Back button at top takes users to /how-to')
        cy.get('[data-cy="go-back"]:eq(0)')
          .as('topBackButton')
          .click()
          .url()
          .should('include', '/how-to')

        cy.step('Back button at bottom takes users to /how-to')
        cy.visit(specificHowtoUrl)
        cy.get('[data-cy="go-back"]:eq(1)')
          .as('bottomBackButton')
          .click()
          .url()
          .should('include', '/how-to')
      })

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
      })
    })

    it('[By Owner]', () => {
      cy.step('Edit button is available to the owner')
      cy.visit(specificHowtoUrl)
      cy.login('howto_creator@test.com', 'test1234')
      cy.get('[data-cy=edit]')
        .click()
        .url()
        .should('include', `${specificHowtoUrl}/edit`)
    })
  })

  describe('[Fail to find a How-to]', () => {
    const id = uuid()
    const howToNotFoundUrl = `/how-to/this-how-to-does-not-exist-${id}`

    it('[Redirects to search]', () => {
      cy.visit(howToNotFoundUrl)
      cy.location('pathname').should('eq', '/how-to')
      cy.location('search').should(
        'eq',
        `?search=this%20how%20to%20does%20not%20exist%20${id.replaceAll(
          '-',
          '%20',
        )}&source=how-to-not-found`,
      )
    })
  })
})
