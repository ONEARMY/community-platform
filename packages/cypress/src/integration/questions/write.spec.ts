const creatorEmail = 'howto_creator@test.com'
const creatorPassword = 'test1234'

describe('[Question]', () => {
  describe('[Create a question]', () => {
    const initialTitle = 'Health consequences'
    const initialExpectedSlug = 'health-consequences'
    const initialQuestionDescription =
      "Hello! I'm wondering how people feel about the health concerns about working with melting plastic and being in environments with microplastics. I have been working with recycling plastic (hdpe) for two years now, shredding and injection molding and haven't had any bad consequences yet. But with the low knowledge around micro plastics and its effects on the human body, and many concerns and hypotheses I have been a bit concerned lately.So I would like to ask the people in this community how you are feeling about it, and if you have experienced any issues with the microplastics or gases yet, if so how long have you been working with it? And what extra steps do you take to be protected from it? I use a gas mask with dust filters"
    const tag1 = 'product'
    const tag2 = 'workshop'

    const updatedTitle = 'Health consequences v2'
    const updatedExpectedSlug = 'health-consequences-v2'
    const updatedQuestionDescription = `${initialQuestionDescription} and super awesome goggles`

    it('[By Authenticated]', () => {
      cy.visit('/questions')
      cy.login(creatorEmail, creatorPassword)

      cy.step('Go to create page')
      cy.get('[data-cy=create]').click()
      cy.get('[data-cy=question-create-title]')

      cy.step('Add title field')
      cy.get('[data-cy=field-title]').type(initialTitle).blur({ force: true })

      cy.step('Add title description')
      cy.get('[data-cy=field-description]').type(initialQuestionDescription, {
        delay: 0,
      })

      // To do - Set categories so this can then be selected here.

      cy.selectTag(tag1, '[data-cy="tag-select"]')
      cy.selectTag(tag2, '[data-cy="tag-select"]')

      cy.step('Submit question')
      cy.get('[data-cy=submit]')
        .click()
        .url()
        .should('include', `/questions/${initialExpectedSlug}`)

      cy.step('All question fields visible')
      cy.contains(initialTitle)
      cy.contains(initialQuestionDescription)
      cy.contains(tag1)
      cy.contains(tag2)

      cy.step('Edit question')
      cy.get('[data-cy=edit]')
        .click()
        .url()
        .should('include', `/questions/${initialExpectedSlug}/edit`)

      cy.step('Update title field')
      cy.get('[data-cy=field-title]').clear().type(updatedTitle).blur()

      cy.step('Add title description')
      cy.get('[data-cy=field-description]')
        .clear()
        .type(updatedQuestionDescription, { delay: 0 })

      cy.step('Submit updated question')
      cy.get('[data-cy=submit]')
        .click()
        .url()
        .should('include', `/questions/${updatedExpectedSlug}`)

      cy.step('All updated fields visible on page')
      cy.contains(updatedTitle)
      cy.contains(updatedQuestionDescription)

      cy.step('All updated fields visiable on list')
      cy.visit('/questions')
      cy.contains(updatedTitle)
      // cy.contains(tag1) <-- These should be added to the main list display
      // cy.contains(tag2)
    })
  })
})
