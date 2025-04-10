import { MOCK_DATA } from '../../data'

const news = MOCK_DATA.news[0]

describe('[News.Read]', () => {
  describe('[List news]', () => {
    it('[By Everyone]', () => {
      cy.visit(`/news/`)
      cy.step('Has expected page title')
      cy.title().should('include', `News`)

      cy.step('News displays expected fields')
      cy.get('[data-cy=news-list-item]')
        .first()
        .within(() => {
          cy.get('[data-cy=news-list-item-title]')
          cy.get('[data-cy=news-list-item-summary]')
          cy.get('[data-cy=category]')
          cy.get('[data-cy=Username]')
        })
    })
  })

  describe('[Individual news]', () => {
    it('[By Everyone]', () => {
      const { body, slug, title } = news

      const pageTitle = `${title} - News - Precious Plastic`

      cy.step('Can visit news')
      cy.visit(`/news/${slug}`)

      cy.step('All metadata visible')
      cy.contains(/\d+ view/)
      cy.contains(/\d+ comment/)

      cy.step('[Populates title, SEO and social tags]')
      cy.title().should('eq', pageTitle)
      cy.get('meta[name="description"]').should('have.attr', 'content', body)

      // OpenGraph (facebook)
      cy.get('meta[property="og:title"]').should(
        'have.attr',
        'content',
        pageTitle,
      )
      cy.get('meta[property="og:description"]').should(
        'have.attr',
        'content',
        body,
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
        body,
      )
      cy.step('Links in description are clickable')
      cy.contains('a', 'OneArmy').should(
        'have.attr',
        'href',
        'https://www.onearmy.earth/',
      )

      cy.step('Breadcrumbs work')
      cy.get('[data-cy=breadcrumbsItem]').first().should('contain', 'News')
      cy.get('[data-cy=breadcrumbsItem]')
        .first()
        .children()
        .should('have.attr', 'href')
        .and('equal', `/news`)

      cy.get('[data-cy=breadcrumbsItem]').eq(1).should('contain', title)

      // cy.step('Logged in users can complete actions')
      // cy.signIn('howto_creator@test.com', 'test1234')
      // cy.visit(`/news/${slug}`) // Page doesn't reload after login

      // cy.get('[data-cy=follow-button]').click()
      // cy.contains(`1 following`)

      // cy.get('[data-cy=vote-useful]').click()
      // cy.contains(`1 useful`)
    })
  })
})
