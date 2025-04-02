import { MOCK_DATA } from '../../data'

const question = MOCK_DATA.questions[0]

describe('[Questions]', () => {
  describe('[List questions]', () => {
    it('[By Everyone]', () => {
      cy.visit(`/questions/`)

      cy.step('Has expected page title')
      cy.title().should('include', `Questions`)

      cy.step('Questions display')

      cy.get('[data-cy=question-list-item]')
        .first()
        .within(() => {
          cy.get('[data-cy=question-list-item-title]')
          cy.get('[data-cy=category]')
          cy.get('[data-cy=Username]')
          cy.get('[data-tooltip-content="How useful it is"]')
          cy.get('[data-tooltip-content="Total comments"]')
        })
    })
  })

  describe('[Individual questions]', () => {
    it('[By Everyone]', () => {
      const { description, slug, title } = question

      const pageTitle = `${title} - Question - Precious Plastic`

      cy.step('Can visit question')
      cy.visit(`/questions/${slug}`)

      cy.step('All metadata visible')
      cy.contains(/\d+ view/)
      cy.contains(/\d+ following/)
      cy.contains(/\d+ useful/)

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
      cy.step('Links in description are clickable')
      cy.contains('a', 'https://www.onearmy.earth/')

      cy.step('Breadcrumbs work')
      cy.get('[data-cy=breadcrumbsItem]').first().should('contain', 'Question')
      cy.get('[data-cy=breadcrumbsItem]')
        .first()
        .children()
        .should('have.attr', 'href')
        .and('equal', `/questions`)

      cy.get('[data-cy=breadcrumbsItem]').eq(1).should('contain', 'Machines')

      cy.get('[data-cy=breadcrumbsItem]').eq(2).should('contain', title)

      cy.step('Logged in users can complete actions')
      cy.signIn('howto_creator@test.com', 'test1234')
      cy.visit(`/questions/${slug}`) // Page doesn't reload after login

      // cy.get('[data-cy=follow-button]').click()
      // cy.contains(`1 following`)

      // cy.get('[data-cy=vote-useful]').click()
      // cy.contains(`1 useful`)
    })
  })
})
