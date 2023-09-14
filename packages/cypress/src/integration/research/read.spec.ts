describe('[Research]', () => {
  const SKIP_TIMEOUT = { timeout: 300 }
  const totalResearchCount = 2
  const researchArticleUrl = '/research/qwerty'
  const authoredResearchArticleUrl = '/research/a-test-research'

  beforeEach(() => {
    cy.visit('/research')
  })

  describe('[List research articles]', () => {
    describe('[By Everyone]', () => {
      it('[Shows a list of articles]', () => {
        cy.step('All research articles are shown')

        cy.get('[data-cy="ResearchListItem"]')
          .its('length')
          .should('be.eq', totalResearchCount)
      })

      it('[See all info]', () => {
        cy.step('Research cards has basic info')
        cy.get(
          `[data-cy="ResearchListItem"] a[href="${researchArticleUrl}"]`,
        ).within(() => {
          cy.contains('qwerty').should('be.exist')
          cy.contains('event_reader').should('be.exist')
          cy.get('[data-cy="ItemUpdateText"]').contains('1').should('be.exist')
        })

        cy.step(
          `Open Research details when click on a Research ${researchArticleUrl}`,
        )
        cy.get(
          `[data-cy="ResearchListItem"] a[href="${researchArticleUrl}"]`,
          SKIP_TIMEOUT,
        ).click()
        cy.url().should('include', researchArticleUrl)
      })
    })
  })

  describe('[Read a research article]', () => {
    describe('[By Everyone]', () => {
      beforeEach(() => {
        cy.visit(researchArticleUrl)
      })

      it('[Delete button should not be visible to everyone', () => {
        cy.step('Delete button should not be visible')
        cy.get('[data-cy="Research: delete button"]').should('not.exist')
      })

      it('[Views only visible for beta-testers]', () => {
        cy.step(`ViewsCounter should not be visible`)
        cy.get('[data-cy="ViewsCounter"]').should('not.exist')
      })
    })

    describe('[By Author]', () => {
      beforeEach(() => {
        cy.login('demo_user@example.com', 'demo_user')
        cy.visit(authoredResearchArticleUrl)
      })

      it('[Delete button is visible]', () => {
        cy.step('Delete button should be visible to the author of the article')

        cy.get('[data-cy="Research: delete button"]').should('exist')
      })
    })

    describe('[By Beta-tester]', () => {
      beforeEach(() => {
        cy.login('demo_beta_tester@example.com', 'demo_beta_tester')
        cy.visit(researchArticleUrl)
      })

      it('[Views show on multiple research articles]', () => {
        cy.step('Views show on first research article')
        cy.get('[data-cy="ViewsCounter"]').should('exist')

        cy.step('Go back')
        cy.go('back')

        cy.step('Views show on second research article')
        cy.visit('/research/a-test-research')
        cy.get('[data-cy="ViewsCounter"]').should('exist')
      })
    })

    describe('[By Admin]', () => {
      beforeEach(() => {
        cy.login('demo_admin@example.com', 'demo_admin')
        cy.visit(researchArticleUrl)
      })

      it('[Delete button is visible]', () => {
        cy.step('Delete button should be visible to the author of the article')

        cy.get('[data-cy="Research: delete button"]').should('exist')
      })
    })
  })

  describe('[Read a soft-deleted Research Article]', () => {
    const deletedResearchUrl = '/research/a-deleted-test-research'
    beforeEach(() => {
      cy.visit(deletedResearchUrl)
    })

    describe('[By Everyone]', () => {
      it('[Marked for deletion message]', () => {
        cy.step(
          'There should be a message stating the research is marked for deletion',
        )

        cy.get('[data-cy="research-deleted"]').contains('Marked for deletion')
      })
    })

    describe('[By Owner]', () => {
      beforeEach(() => {
        cy.login('demo_user@example.com', 'demo_user')
        cy.visit(deletedResearchUrl)
      })

      it('[Delete Button is disabled]', () => {
        cy.step('Delete button should be disabled')

        cy.get('[data-cy="Research: delete button"]').should('be.disabled')
      })
    })

    describe('[By Admin]', () => {
      beforeEach(() => {
        cy.login('demo_admin@example.com', 'demo_admin')
        cy.visit(deletedResearchUrl)
      })

      it('[Delete Button is disabled]', () => {
        cy.step('Delete button should be disabled')

        cy.get('[data-cy="Research: delete button"]').should('be.disabled')
      })
    })
  })
})
