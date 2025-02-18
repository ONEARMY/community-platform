import { DifficultyLevel } from 'oa-shared'

import { MOCK_DATA } from '../../data'

const library = Object.values(MOCK_DATA.library)

describe('[How To]', () => {
  beforeEach(() => {
    cy.visit('/library')
  })

  describe('[List Library Projects]', () => {
    it('[By Everyone]', () => {
      cy.step('Has expected page title')
      cy.title().should('include', `Library`)

      cy.step('Can search for items')
      cy.get('[data-cy=library-search-box]').click().type('beams')
      cy.get('[data-cy=card]').its('length').should('be.eq', 1)

      cy.step('All basic info displayed on each card')
      const projectSlug = 'make-glass-like-beams'
      const projectUrl = `/library/${projectSlug}`
      const coverFileRegex = /howto-beams-glass-0-3.jpg/

      cy.get('[data-cy=card]').within(() => {
        cy.contains('Make glass-like beams').should('be.visible')
        cy.get('img').should('have.attr', 'src').and('match', coverFileRegex)
        cy.get('[data-cy=Username]').contains('howto_creator')
        cy.get('[data-cy=category]').contains('Guides')
        cy.get('a').should('have.attr', 'href').and('eq', projectUrl)
      })

      cy.step('Can clear search')
      cy.get('[data-cy=close]').click()
      cy.get('[data-cy=card]').its('length').should('be.above', 1)

      cy.step('Can select a category to limit items displayed')
      cy.get('[data-cy=category]').contains('Moulds')
      cy.get('[data-cy=CategoryVerticalList]').within(() => {
        cy.contains('Guides').click()
      })
      cy.get('[data-cy=CategoryVerticalList-Item-active]')
      cy.get('[data-cy=category]').contains('Guides')
      cy.get('[data-cy=category]').contains('Moulds').should('not.exist')
    })
  })

  describe('[Read a project]', () => {
    const itemUrl = '/library/make-an-interlocking-brick'
    const coverFileRegex = /brick-12-1.jpg/

    describe('[By Everyone]', () => {
      it('[See all info]', () => {
        const item = library[0]
        // Hack to avoid flaky test as the tags are not being loaded on time
        cy.queryDocuments('library', '_id', '==', item._id)

        cy.step('Old url pattern redirects to the new location')
        cy.visit('/library/make-an-interlocking-brick')
        cy.url().should('include', itemUrl)

        cy.step('Edit button is not available')
        cy.get('[data-cy=edit]').should('not.exist')

        cy.step('Project has basic info')
        cy.title().should('eq', `${item.title} - Library - Precious Plastic`)
        cy.get('[data-cy=library-basis]').then(($summary) => {
          expect($summary).to.contain('howto_creator', 'Author')
          expect($summary).to.contain('Last update', 'Edit')
          expect($summary).to.contain('Make an interlocking brick', 'Title')
          expect($summary).to.contain(
            'show you how to make a brick using the injection machine',
            'Description',
          )
          expect($summary).to.contain('3-4 weeks', 'Duration')
          expect($summary).to.contain(DifficultyLevel.HARD, 'Difficulty')
          expect($summary.find('img[alt="project cover image"]'))
            .to.have.attr('src')
            .match(coverFileRegex)
        })
        cy.wait(2000)
        cy.get('[data-cy=tag-list]').then(($tagList) => {
          expect($tagList).to.contain('product')
          expect($tagList).to.contain('injection')
        })
        cy.get('[data-cy=file-download-counter]').should(
          'contain',
          '1,234 downloads',
        )

        cy.step('Breadcrumbs work')
        cy.get('[data-cy=breadcrumbsItem]').first().should('contain', 'Library')
        cy.get('[data-cy=breadcrumbsItem]')
          .first()
          .children()
          .should('have.attr', 'href')
          .and('equal', `/library`)

        cy.get('[data-cy=breadcrumbsItem]')
          .eq(1)
          .should('contain', item.category.label)
        cy.get('[data-cy=breadcrumbsItem]')
          .eq(1)
          .children()
          .should('have.attr', 'href')
          .and('equal', `/library?category=${item.category._id}`)

        cy.get('[data-cy=breadcrumbsItem]').eq(2).should('contain', item.title)

        cy.step('Download file button should redirect to sign in')
        cy.get('div[data-tooltip-content="Login to download"]')
          .first()
          .click()
          .url()
          .should('include', 'sign-in')

        cy.step('All steps are shown')
        cy.visit(itemUrl)
        cy.get('[data-cy^=step_]').should('have.length', 12)

        cy.step('All step info is shown')
        cy.get('[data-cy=step_12]').within(($step) => {
          // const pic1Regex = /brick-12-1.jpg/
          // const pic3Regex = /brick-12.jpg/
          expect($step).to.contain('12', 'Step #')
          expect($step).to.contain('Explore the possibilities!', 'Title')
          expect($step).to.contain(
            `more for a partition or the wall`,
            'Description',
          )

          // Commented out until https://github.com/ONEARMY/community-platform/issues/3462
          //
          //   cy.step('Step image is updated on thumbnail click')
          //   cy.get('[data-cy="active-image"]')
          //     .should('have.attr', 'src')
          //     .and('match', pic1Regex)
          //   cy.get('[data-cy=thumbnail]:eq(2)').click()
          //   cy.get('[data-cy="active-image"]')
          //     .should('have.attr', 'src')
          //     .and('match', pic3Regex)
        })

        cy.step(`Comment functionality prompts user to login`)
        cy.get(`[data-cy="comments-login-prompt"]`).should('be.visible')

        cy.step('Video embed exists')
        cy.get('[data-testid="VideoPlayer"]').within(() => {
          cy.get('iframe').should('have.attr', 'src').and('include', 'youtube')
        })
        // This fails in firefox due to cross security, simply check url
        // .should(iframe => expect(iframe.contents().find('video')).to.visible)
      })

      it('[Delete button should not be visible to everyone', () => {
        cy.step('Delete button should not be visible')
        cy.get('[data-cy="Library: delete button"]').should('not.exist')
      })
    })

    describe('[By Authenticated]', () => {
      it('[Allows opening of attachments]', () => {
        const visitor = MOCK_DATA.users.subscriber

        cy.signIn(visitor.email, visitor.password)
        cy.visit(itemUrl)
        cy.step('[Presents the donation request before opening of attachments]')
        cy.step('Shows modal')
        cy.wait(2000)
        cy.get('[data-cy=downloadButton]').first().click()
        cy.get('[data-cy=DonationRequest]').should('be.visible')
        cy.get('[data-cy=DonationRequest]').contains('Support our work')

        cy.step('Can skip to download')
        cy.get('[data-cy=DonationRequestSkip]').should(
          'have.attr',
          'target',
          '_blank',
        )
      })
    })

    describe('[By Owner]', () => {
      beforeEach(() => {
        cy.signIn('howto_creator@test.com', 'test1234')
        cy.visit(itemUrl)
      })

      it('[Delete button is visible]', () => {
        cy.step('Delete button should be visible to the author of the how-to')

        cy.get('[data-cy="Library: delete button"]').should('be.visible')
      })

      it('[Edit button is visible]', () => {
        cy.step('Edit button is available to the owner')
        cy.get('[data-cy=edit]')
          .click()
          .url()
          .should('include', `${itemUrl}/edit`)
      })
    })

    describe('[By Admin]', () => {
      beforeEach(() => {
        cy.signIn('demo_admin@example.com', 'demo_admin')
        cy.visit(itemUrl)
      })

      it('[Delete button is visible]', () => {
        cy.step('Delete button should be visible to the author of the article')

        cy.get('[data-cy="Library: delete button"]').should('be.visible')
      })
    })
  })

  describe('[Read a soft-deleted How-to]', () => {
    const deletedUrl = '/library/deleted-how-to'

    beforeEach(() => {
      cy.visit(deletedUrl)
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
        cy.signIn('demo_user@example.com', 'demo_user')
        cy.visit(deletedUrl)
      })

      it('[Delete Button is disabled]', () => {
        cy.step('Delete button should be disabled')

        cy.get('[data-cy="Library: delete button"]').should('be.disabled')
      })
    })

    describe('[By Admin]', () => {
      beforeEach(() => {
        cy.signIn('demo_user@example.com', 'demo_user')
        cy.visit(deletedUrl)
      })

      it('[Delete Button is disabled]', () => {
        cy.step('Delete button should be disabled')

        cy.get('[data-cy="Library: delete button"]').should('be.disabled')
      })
    })
  })

  describe('[Fail to find a project]', () => {
    const notFoundUrl = `/library/this-project-does-not-exist`

    it('[Redirects to search]', () => {
      cy.visit(notFoundUrl)
      cy.get('[data-test="NotFound: Heading"').should('be.visible')
    })
  })
})
