import { MOCK_DATA } from '../../data'

describe('[Library]', () => {
  describe('[SEO Metadata]', () => {
    const { slug, title, description } = MOCK_DATA.library[0]

    const pageTitle = `${title} - Library - Precious Plastic`

    it('[Populates title and description tags]', () => {
      cy.visit(`/library/${slug}`)
      // General
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
    })
  })
})
