import { MOCK_DATA } from '../../data'

const article = Object.values(MOCK_DATA.research)[0]

describe('[Research]', () => {
  const { description, updates, slug, title } = article

  const authoredResearchArticleUrl = '/research/a-test-research'
  const image = updates[0].images[0].publicUrl
  const pageTitle = `${title} - Research - Precious Plastic`
  const researchArticleUrl = `/research/${slug}`

  describe('[Read a research article]', () => {
    describe('[By Everyone]', () => {
      it('[List View]', () => {
        cy.visit('/research')

        cy.step('Has expected page title')
        cy.title().should('include', `Research`)

        cy.step('Can search for items')
        cy.get('[data-cy=research-search-box]').click().type('qwerty')
        cy.get('[data-cy=ResearchListItem]').its('length').should('be.eq', 1)

        cy.step('All basic info displayed on each card')
        const researchTitle = 'Qwerty'
        const researchUrl = '/research/qwerty'
        const coverImageFileName = '1426018318_414579695-17fcd6de5f7'

        cy.get('[data-cy=ResearchListItem]').within(() => {
          cy.contains(researchTitle).should('be.visible')
          cy.get('img')
            .should('have.attr', 'src')
            .and('include', coverImageFileName)
          cy.get('[data-cy=Username]').contains('event_reader')
          cy.get('[data-cy=category]').contains('Landscape')
          cy.get('a').should('have.attr', 'href').and('eq', researchUrl)
          cy.get('[data-cy=ItemResearchStatus]').contains('In progress')
          cy.get('[data-tooltip-content="How useful is it"]')
          cy.get('[data-tooltip-content="Total comments"]')
          cy.get('[data-tooltip-content="Amount of updates"]')
        })

        cy.step('Can clear search')
        cy.get('[data-cy=close]').click()
        cy.get('[data-cy=ResearchListItem]').its('length').should('be.above', 1)

        cy.step('Can select a category to limit items displayed')
        cy.get('[data-cy=category]').contains('Food')
        cy.get('[data-cy=CategoryVerticalList]').within(() => {
          cy.contains('Landscape').click()
        })
        cy.get('[data-cy=CategoryVerticalList-Item-active]')
        cy.get('[data-cy=category]').contains('Landscape')
        cy.get('[data-cy=category]').contains('Food').should('not.exist')

        cy.step('Can remove the category filter by selecting it again')
        cy.get('[data-cy=CategoryVerticalList]').within(() => {
          cy.contains('Landscape').click()
        })
        cy.get('[data-cy=category]').contains('Food')

        cy.step('Can filter by research status')
        cy.get('[data-cy=ItemResearchStatus]').contains('In progress')
        cy.contains('Filter by status').click({ force: true })
        cy.contains('Completed').click({ force: true })
        cy.get('[data-cy=ItemResearchStatus]').contains('Completed')
        cy.get('[data-cy=ItemResearchStatus]')
          .contains('In progress')
          .should('not.exist')
      })

      it('[Visible to everyone]', () => {
        cy.step('Can visit research')
        cy.visit(researchArticleUrl)
        const updateId = updates[2].id

        cy.title().should(
          'eq',
          `${article.title} - Research - Precious Plastic`,
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
          .eq(2)
          .should('contain', article.title)

        cy.step('Can scroll to specific research updates')
        cy.get(`[id="update_${updateId}"]`)
          .scrollIntoView()
          .should('be.visible')

        cy.step('Can get and paste update anchor')
        cy.get('[data-cy=ResearchLinkToUpdate]').last().click()
        cy.window().then((window) => {
          window.navigator.clipboard.readText().then((clipboardItem) => {
            cy.visit(clipboardItem)
            cy.contains(article.title)
          })
        })
      })
    })

    describe('[By Author]', () => {
      beforeEach(() => {
        cy.signIn('demo_user@example.com', 'demo_user')
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
        cy.signIn('demo_admin@example.com', 'demo_admin')
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
        cy.signIn('demo_user@example.com', 'demo_user')
        cy.visit(deletedResearchUrl)
      })

      it('[Delete Button is disabled]', () => {
        cy.step('Delete button should be disabled')

        cy.get('[data-cy="Research: delete button"]').should('be.disabled')
      })
    })

    describe('[By Admin]', () => {
      beforeEach(() => {
        cy.signIn('demo_admin@example.com', 'demo_admin')
        cy.visit(deletedResearchUrl)
      })

      it('[Delete Button is disabled]', () => {
        cy.step('Delete button should be disabled')

        cy.get('[data-cy="Research: delete button"]').should('be.disabled')
      })
    })
  })
})
