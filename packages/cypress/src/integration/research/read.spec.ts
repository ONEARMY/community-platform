import { MOCK_DATA } from '../../data'

const article = Object.values(MOCK_DATA.research)[0]

describe('[Research]', () => {
  const { description, updates, researchCategory, slug, title } = article

  const authoredResearchArticleUrl = '/research/a-test-research'
  const image = updates[0].images[0].downloadUrl
  const pageTitle = `${title} - Research - Community Platform`
  const researchArticleUrl = `/research/${slug}`

  describe('[Read a research article]', () => {
    describe('[By Everyone]', () => {
      it('[Visible to everyone]', () => {
        cy.step('Can visit research')
        cy.visit(researchArticleUrl)
        cy.title().should(
          'eq',
          `${article.title} - Research - Community Platform`,
        )
        cy.step('[Populates title, SEO and social tags]')
        cy.title().should('eq', pageTitle)
        cy.get('meta[name="description"]').should(
          'have.attr',
          'content',
          description,
        )

        // OpenGraph (facebook)
        cy.get('meta[property="og:title"]').should(
          'have.attr',
          'content',
          pageTitle,
        )
        cy.get('meta[property="og:description"]').should(
          'have.attr',
          'content',
          description,
        )
        cy.get('meta[property="og:image"]').should(
          'have.attr',
          'content',
          image,
        )

        // Twitter
        cy.get('meta[name="twitter:title"]').should(
          'have.attr',
          'content',
          pageTitle,
        )
        cy.get('meta[name="twitter:description"]').should(
          'have.attr',
          'content',
          description,
        )
        cy.get('meta[name="twitter:image"]').should(
          'have.attr',
          'content',
          image,
        )

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
          .should('contain', researchCategory.label)
        cy.get('[data-cy=breadcrumbsItem]')
          .eq(1)
          .children()
          .should('have.attr', 'href')
          .and('equal', `/research?category=${researchCategory._id}`)

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

        cy.get('[data-cy="Research: delete button"]').should('be.visible')
      })
    })

    describe('[By Admin]', () => {
      beforeEach(() => {})

      it('[Delete button is visible]', () => {
        cy.login('demo_admin@example.com', 'demo_admin')
        cy.visit(researchArticleUrl)

        cy.step('Delete button should be visible to the author of the article')
        cy.get('[data-cy="Research: delete button"]').should('be.visible')
      })
    })
  })

  describe('[Read a soft-deleted Research Article]', () => {
    const deletedResearchUrl = '/research/a-deleted-test-research'

    describe('[By Everyone]', () => {
      it('[Marked for deletion message]', () => {
        cy.visit(deletedResearchUrl)
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
