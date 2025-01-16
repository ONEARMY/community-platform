import { MOCK_DATA } from '../../data'

const question = Object.values(MOCK_DATA.questions)[0]

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
      const {
        description,
        images,
        slug,
        subscribers,
        title,
        votedUsefulBy,
        questionCategory,
      } = question

      const pageTitle = `${title} - Question - Precious Plastic`
      const image = images[0].downloadUrl

      cy.step('Can visit question')
      cy.visit(`/questions/${slug}`)

      cy.step('All metadata visible')
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
      cy.get('meta[property="og:image"]').should('have.attr', 'content', image)

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
      cy.get('meta[name="twitter:image"]').should('have.attr', 'content', image)

      cy.step('Links in description are clickable')
      cy.contains('a', 'https://www.onearmy.earth/')

      cy.step('Breadcrumbs work')
      cy.get('[data-cy=breadcrumbsItem]').first().should('contain', 'Question')
      cy.get('[data-cy=breadcrumbsItem]')
        .first()
        .children()
        .should('have.attr', 'href')
        .and('equal', `/questions`)

      cy.get('[data-cy=breadcrumbsItem]')
        .eq(1)
        .should('contain', questionCategory.label)
      cy.get('[data-cy=breadcrumbsItem]')
        .eq(1)
        .children()
        .should('have.attr', 'href')
        .and('equal', `/questions?category=${questionCategory._id}`)

      cy.get('[data-cy=breadcrumbsItem]').eq(2).should('contain', title)

      cy.step('Logged in users can complete actions')
      cy.login('howto_creator@test.com', 'test1234')
      cy.visit(`/questions/${slug}`) // Page doesn't reload after login

      cy.get('[data-cy=follow-button]').click()
      cy.contains(`${subscribers.length + 1} following`)

      cy.get('[data-cy=vote-useful]').click()
      cy.contains(`${votedUsefulBy.length + 1} useful`)
    })
  })
})
