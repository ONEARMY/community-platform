import crypto from 'crypto'

describe('[How To]', () => {
  const SKIP_TIMEOUT = { timeout: 300 }
  const totalHowTo = 7

  describe('[List how-tos]', () => {
    const howtoUrl = '/how-to/make-glass-like-beams'
    const coverFileRegex = /howto-beams-glass-0-3.jpg/
    beforeEach(() => {
      cy.visit('/how-to')
    })
    it('[By Everyone]', () => {
      cy.step('No tag is selected')
      cy.get('.data-cy__multi-value__label').should('not.exist')

      cy.step('More How-tos button is hidden')
      cy.get('[data-cy=more-how-tos]', SKIP_TIMEOUT).should('be.hidden')

      cy.step('All how-tos are shown')

      cy.get('[data-cy=card]')
        .its('length')
        .should('be.eq', totalHowTo)

      cy.step('How-to cards has basic info')
      cy.get(`[data-cy=card] > a[href="${howtoUrl}"]`).within(() => {
        cy.contains('Make glass-like beams').should('be.exist')
        cy.contains('By howto_creator').should('be.exist')
        cy.get('img')
          .should('have.attr', 'src')
          .and('match', coverFileRegex)
        cy.contains('extrusion').should('be.exist')
      })

      cy.step(`Open how-to details when click on a how-to ${howtoUrl}`)
      cy.get(`[data-cy=card] > a[href="${howtoUrl}"]`, SKIP_TIMEOUT).click()
      cy.url().should('include', howtoUrl)
    })

    it('[By Authenticated]', () => {
      cy.login('howto_reader@test.com', 'test1234')
      cy.step('Create button is available')
      cy.get('[data-cy=create]')
        .click()
        .url()
    })
  })

  describe('[Filter with Tag]', () => {
    beforeEach(() => {
      cy.visit('/how-to')
      cy.logout()
    })
    it('[By Everyone]', () => {
      cy.step('Select a tag')
      cy.selectTag('product')
      cy.get('[data-cy=card]')
        .its('length')
        .should('be.eq', 3)

      cy.step('Type and select a tag')
      cy.selectTag('injection')

      cy.get('[data-cy=card]')
        .its('length')
        .should('be.eq', 2)

      cy.step('Remove a tag')
      cy.get('.data-cy__multi-value__label')
        .contains('injection')
        .parent()
        .find('.data-cy__multi-value__remove')
        .click()
      cy.get('.data-cy__multi-value__label')
        .contains('injection')
        .should('not.exist')
      cy.get('[data-cy=card]')
        .its('length')
        .should('be.eq', 3)

      cy.step('Remove all tags')
      cy.get('.data-cy__clear-indicator').click()
      cy.get('.data-cy__multi-value__label').should('not.exist')
      cy.get('[data-cy=card]')
        .its('length')
        .should('be.eq', totalHowTo)
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
        cy.get('[data-cy=how-to-basis]').then($summary => {
          expect($summary).to.contain('By howto_creator', 'Author')
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
        cy.get('[data-cy=step_11]').within($step => {
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

        cy.step('Video embed exists')
        cy.get('[data-cy="video-embed"]').within(() => {
          cy.get('iframe')
            .should('have.attr', 'src')
            .and('include', 'youtube')
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
    })

    it('[By Authenticated}', () => {
      cy.step('Edit button is unavailable to non-resource owners')
      cy.login('howto_reader@test.com', 'test1234')
      cy.visit(specificHowtoUrl)
      cy.get('[data-cy=edit]').should('not.exist')
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
    const uuid = crypto.randomBytes(16).toString('hex')
    const howToNotFoundUrl = `/how-to/this-how-to-does-not-exist-${uuid}`

    it('[Redirects to search]', () => {
      cy.visit(howToNotFoundUrl)
      cy.location('pathname').should('eq', '/how-to')
      cy.location('search').should(
        'eq',
        `?search=this+how+to+does+not+exist+${uuid}&source=how-to-not-found`,
      )
    })
  })
})
