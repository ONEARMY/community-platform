describe('[How To]', () => {
  const howtoUrl = '/how-to/my-awesome-howto'
  const coverFileRegex = /IMG_0328.jpg/
  const SKIP_TIMEOUT = {timeout: 300};

  describe('[List how-tos]', () => {
    beforeEach(() => {
      cy.visit('/how-to')
    })

    it('[By any user]', () => {
      cy.log('No tag is selected')
      cy.get('[data-cy=tag-select]').get('.data-cy__multi-value__label').should('not.exist')

      cy.log('More How-tos button is hidden')
      cy.get('[data-cy=more-how-tos]', SKIP_TIMEOUT).should('be.hidden')

      cy.log('Some how-tos are shown')
      cy.get('[data-cy=card]').its('length').should('be.gte', 15)

      cy.log('How-to cards has basic info')
      cy.get('[data-cy=card] > a[href="/how-to/my-awesome-howto"]', SKIP_TIMEOUT)
        .then(($card) => {
          expect($card).to.contain('My awesome how-to')
          expect($card).to.contain('By testuser')
          expect($card.find('img')).to.have.attr('src').match(coverFileRegex)
        })


      cy.log(`Open how-to details when click on a how-to ${howtoUrl}`)
      cy.get(`[data-cy=card] > a[href="${howtoUrl}"]`, SKIP_TIMEOUT)
        .click()
      cy.url().should('include', howtoUrl)
    })
  })

  describe('[How-to details]', () => {
    const attachment1 = { url: 'Web_1133.pdf' }
    const attachment2 = { url: 'web.pdf' }
    beforeEach(() => {
      cy.visit(howtoUrl)
    })

    describe('[By any user]', () => {
      it('[See all info]', () => {
        cy.log('Edit button is not available')
        cy.get('[data-cy=edit]').should('not.exist')

        cy.log('How-to has basic info')
        cy.get('[data-cy=how-to-basis]').then(($summary) => {
          expect($summary).to.contain('By testuser', 'Author')
          expect($summary).to.contain('My awesome how-to', 'Title')
          expect($summary).to.contain('An intro goes here', 'Description')
          expect($summary).to.contain('2 steps', 'No. of Steps')
          expect($summary).to.contain('1-2 weeks', 'Duration')
          expect($summary).to.contain('Medium', 'Difficulty')
          expect($summary).to.contain('injection', 'Tag')
          expect($summary).to.contain('sorting', 'Tag')
          expect($summary.find('img[alt="how-to cover"]')).to.have.attr('src').match(coverFileRegex)
        })

        cy.log('Attachments are opened in new tabs')
        cy.get(`a[href*="${attachment1.url}"]`).should('have.attr', 'target', '_blank')
        cy.get(`a[href*="${attachment2.url}"]`).should('have.attr', 'target', '_blank')

        cy.log('All steps are shown')
        cy.get('[data-cy=step]').should('have.length', 2)

        cy.log('Step#1 info is shown')
        cy.get('[data-cy=step]:nth-child(1)').then(($firstStep) => {
          expect($firstStep).to.contain('1', 'Step #')
          expect($firstStep).to.contain('My first step', 'Title')
          expect($firstStep).to.contain(`Here's the description, no image required`, 'Description')
        })

        cy.log('Step#2 info is shown')
        cy.get('[data-cy=step]:nth-child(2)').then(($secondStep) => {
          const stepImgRegex = /DSCF1218.JPG/
          expect($secondStep).to.contain('2', 'Step #')
          expect($secondStep).to.contain('This time with an image')
          expect($secondStep.find('img')).to.have.attr('src').match(stepImgRegex)
        })
      })

      it('[Not interested and go back]', () => {
        cy.get('[data-cy="go-back"]').eq(0).as('topBackButton')
          .click()
          .url().should('include', '/how-to')
      })

      it('[Finish reading and go back]', () => {
        cy.get('[data-cy="go-back"]').eq(1).as('bottomBackButton')
          .click()
          .url().should('include', '/how-to')
      })
    })


  })
})
