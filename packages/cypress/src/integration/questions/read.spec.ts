import { MOCK_DATA } from '../../data'

const question = Object.values(MOCK_DATA.questions)[0]

describe('[Questions]', () => {
  // describe('[List questions]', () => {
  //   it('[By Everyone]', () => {
  //     cy.step('All questions visible')
  //     cy.visit('/questions')
  //     cy.get('[data-cy=question-list-item]').each((_, index) => {
  //       cy.contains(questions[index].title)
  //       cy.contains(questions[index]._createdBy)
  //       cy.contains(questions[index].subscribers.length)
  //       cy.contains(questions[index].commentCount)
  //     })

  //     cy.get('[data-cy=questions-search-box]').type('filtering')
  //     cy.contains('This is a test mock for the filtering question')

  //     // To-do: filtering tests
  //   })
  // })

  describe('[Individual questions]', () => {
    it('[By Everyone]', () => {
      const {
        _id,
        description,
        images,
        slug,
        subscribers,
        title,
        votedUsefulBy,
        questionCategory,
      } = question

      const questionDiscussion = Object.values(MOCK_DATA.discussions).find(
        (discussion) => discussion.sourceId === _id,
      )

      const pageTitle = `${title} - Question - Community Platform`
      const image = images[0].downloadUrl

      cy.step('Can visit question')
      cy.visit(`/questions/${slug}`)

      cy.step('All metadata visible')
      cy.contains(`${question.subscribers.length} following`)
      cy.contains(`${question.votedUsefulBy.length} useful`)
      cy.contains(`${questionDiscussion.comments.length} comments`)

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
