import { MOCK_DATA } from '../../data'

const research = Object.values(MOCK_DATA.research)

describe('[Research]', () => {
  const researchArticleUrl = `/research/${research[0].slug}`
  const authoredResearchArticleUrl = '/research/a-test-research'

  beforeEach(() => {
    cy.visit('/research')
  })

  describe('[Read a research article]', () => {
    describe('[By Everyone]', () => {
      beforeEach(() => {
        cy.visit(researchArticleUrl)
      })

      it('[Visible to everyone', () => {
        const article = research[0]
        cy.step('Delete button should not be visible')
        cy.get('[data-cy="Research: delete button"]').should('not.exist')

        cy.step('Breadcrumbs work')
        cy.get('[data-cy=breadcrumbsItem]')
          .first()
          .should('contain', 'Research')
        cy.get('[data-cy=breadcrumbsItem]')
          .first()
          .children()
          .should('have.attr', 'href')
          .and('equal', `/research`)

        cy.get('[data-cy=breadcrumbsItem]')
          .eq(1)
          .should('contain', article.researchCategory.label)
        cy.get('[data-cy=breadcrumbsItem]')
          .eq(1)
          .children()
          .should('have.attr', 'href')
          .and('equal', `/research?category=${article.researchCategory._id}`)

        cy.get('[data-cy=breadcrumbsItem]')
          .eq(2)
          .should('contain', article.title)
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
