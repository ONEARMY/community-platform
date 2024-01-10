import { DifficultyLevel } from 'src/models'
import { v4 as uuid } from 'uuid'

import { MOCK_DATA } from '../../data'

describe('[How To]', () => {
  const SKIP_TIMEOUT = { timeout: 300 }
  const totalHowTo = Object.values(MOCK_DATA.howtos).filter(
    (howTo) => howTo._deleted === false,
  ).length

  describe('[List how-tos]', () => {
    const howtoSlug = 'make-glass-like-beams'
    const howtoUrl = `/how-to/${howtoSlug}`
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
      cy.get(`[data-cy=card][data-cy-howto-slug=${howtoSlug}]`).within(() => {
        cy.contains('Make glass-like beams').should('be.exist')
        cy.get('img').should('have.attr', 'src').and('match', coverFileRegex)
        cy.contains('howto_creator').should('be.exist')
        cy.contains('extrusion').should('be.exist')
        cy.get('a').should('have.attr', 'href').and('eq', howtoUrl)
      })

      cy.step(`Open how-to details when click on a how-to ${howtoUrl}`)
      cy.get(`[data-cy=card] a[href="${howtoUrl}"]:first`, SKIP_TIMEOUT).click()
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
          expect($summary).to.contain('Last update on', 'Edit')
          expect($summary).to.contain('Make an interlocking brick', 'Title')
          expect($summary).to.contain(
            'show you how to make a brick using the injection machine',
            'Description',
          )
          expect($summary).to.contain('3-4 weeks', 'Duration')
          expect($summary).to.contain(DifficultyLevel.HARD, 'Difficulty')
          expect($summary).to.contain('product', 'Tag')
          expect($summary).to.contain('injection', 'Tag')
          expect($summary).to.contain('moul', 'Tag')
          expect($summary.find('img[alt="how-to cover"]'))
            .to.have.attr('src')
            .match(coverFileRegex)
        })

        cy.step('Download file button should redirect to sign in')
        cy.get('div[data-tip="Login to download"]')
          .first()
          .click()
          .url()
          .should('include', 'sign-in')

        cy.step('All steps are shown')
        cy.visit(specificHowtoUrl)
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
        cy.get('[data-testid="VideoPlayer"]').within(() => {
          cy.get('iframe').should('have.attr', 'src').and('include', 'youtube')
        })
        // This fails in firefox due to cross security, simply check url
        // .should(iframe => expect(iframe.contents().find('video')).to.exist)
      })

      it('[Delete button should not be visible to everyone', () => {
        cy.step('Delete button should not be visible')
        cy.get('[data-cy="How-To: delete button"]').should('not.exist')
      })
    })

    describe('[By Authenticated]', () => {
      it('[Allows opening of attachments]', () => {
        cy.login('howto_reader@test.com', 'test1234')
        cy.visit(specificHowtoUrl)

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
      })
    })

    describe('[By Owner]', () => {
      beforeEach(() => {
        cy.visit(specificHowtoUrl)
        cy.login('howto_creator@test.com', 'test1234')
      })

      it('[Delete button is visible]', () => {
        cy.step('Delete button should be visible to the author of the how-to')

        cy.get('[data-cy="How-To: delete button"]').should('exist')
      })

      it('[Edit button is visible]', () => {
        cy.step('Edit button is available to the owner')
        cy.get('[data-cy=edit]')
          .click()
          .url()
          .should('include', `${specificHowtoUrl}/edit`)
      })
    })

    describe('[By Admin]', () => {
      beforeEach(() => {
        cy.login('demo_admin@example.com', 'demo_admin')
        cy.visit(specificHowtoUrl)
      })

      it('[Delete button is visible]', () => {
        cy.step('Delete button should be visible to the author of the article')

        cy.get('[data-cy="How-To: delete button"]').should('exist')
      })
    })
  })

  describe('[Read a soft-deleted How-to]', () => {
    const deletedHowtoUrl = '/how-to/deleted-how-to'
    beforeEach(() => {
      cy.visit(deletedHowtoUrl)
    })

    describe('[By Everyone]', () => {
      it('[Marked for deletion message]', () => {
        cy.step(
          'There should be a message stating the how-to is marked for deletion',
        )

        cy.get('[data-cy="how-to-deleted"]').contains('Marked for deletion')
      })
    })

    describe('[By Owner]', () => {
      beforeEach(() => {
        cy.login('demo_user@example.com', 'demo_user')
        cy.visit(deletedHowtoUrl)
      })

      it('[Delete Button is disabled]', () => {
        cy.step('Delete button should be disabled')

        cy.get('[data-cy="How-To: delete button"]').should('be.disabled')
      })
    })

    describe('[By Admin]', () => {
      beforeEach(() => {
        cy.login('demo_user@example.com', 'demo_user')
        cy.visit(deletedHowtoUrl)
      })

      it('[Delete Button is disabled]', () => {
        cy.step('Delete button should be disabled')

        cy.get('[data-cy="How-To: delete button"]').should('be.disabled')
      })
    })
  })

  describe('[Fail to find a How-to]', () => {
    const id = uuid()
    const howToNotFoundUrl = `/how-to/this-how-to-does-not-exist-${id}`

    it('[Redirects to search]', () => {
      cy.visit(howToNotFoundUrl)
      cy.location('pathname').should('eq', '/how-to/')
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
