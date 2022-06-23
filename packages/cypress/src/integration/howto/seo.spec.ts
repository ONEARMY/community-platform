import { howtos } from '../../data'

describe('[How To]', () => {
  describe('[SEO Metadata]', () => {
    const { slug, title, description, cover_image } =
      howtos.cmMzzlQP00fCckYIeL2e
    it('[Populates title and description tags]', () => {
      cy.visit(`/how-to/${slug}`)
      // General
      cy.title().should('eq', title)
      cy.get('meta[name="description"]').should(
        'have.attr',
        'content',
        description,
      )

      // OpenGraph (facebook)
      cy.get('meta[property="og:title"]').should('have.attr', 'content', title)
      cy.get('meta[property="og:description"]').should(
        'have.attr',
        'content',
        description,
      )
      cy.get('meta[property="og:image"]').should(
        'have.attr',
        'content',
        cover_image.downloadUrl,
      )

      // Twitter
      cy.get('meta[name="twitter:title"]').should('have.attr', 'content', title)
      cy.get('meta[name="twitter:description"]').should(
        'have.attr',
        'content',
        description,
      )
      cy.get('meta[name="twitter:image"]').should(
        'have.attr',
        'content',
        cover_image.downloadUrl,
      )
    })
  })
})
