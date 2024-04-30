const creatorEmail = 'howto_creator@test.com'
const creatorPassword = 'test1234'

describe('[Question]', () => {
  describe('[Create a question]', () => {
    const initialTitle = 'Health consequences'
    const initialExpectedSlug = 'health-consequences'
    const initialQuestionDescription =
      "Hello! I'm wondering how people feel about the health concerns about working with melting plastic and being in environments with microplastics. I have been working with recycling plastic (hdpe) for two years now, shredding and injection molding and haven't had any bad consequences yet. But with the low knowledge around micro plastics and its effects on the human body, and many concerns and hypotheses I have been a bit concerned lately.So I would like to ask the people in this community how you are feeling about it, and if you have experienced any issues with the microplastics or gases yet, if so how long have you been working with it? And what extra steps do you take to be protected from it? I use a gas mask with dust filters"
    const category = 'exhibition'
    const tag1 = 'product'
    const tag2 = 'workshop'

    const updatedTitle = 'Health consequences v2'
    const updatedExpectedSlug = 'health-consequences-v2'
    const updatedQuestionDescription = `${initialQuestionDescription} and super awesome goggles`

    // TODO - Test disabled pending fix to how test runner manages firestore indexes required for operation
    // https://github.com/ONEARMY/community-platform/pull/3461
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('[By Authenticated]', () => {
      cy.visit('/questions')
      cy.login(creatorEmail, creatorPassword)

      cy.step('Go to create page')
      cy.get('[data-cy=loader]').should('not.exist')
      cy.get('[data-cy=create]').click()
      cy.get('[data-cy=question-create-title]')

      cy.step('Add title field')
      cy.get('[data-cy=field-title]').type(initialTitle).blur({ force: true })

      cy.step('Add title description')
      cy.get('[data-cy=field-description]').type(initialQuestionDescription, {
        delay: 0,
      })

      cy.step('Add images')
      cy.get('[data-cy=image-upload-0]')
        .find(':file')
        .attachFile('images/howto-step-pic1.jpg')
      cy.get('[data-cy=image-upload-1]')
        .find(':file')
        .attachFile('images/howto-step-pic2.jpg')

      cy.step('Add category')
      cy.selectTag(category, '[data-cy=category-select]')

      cy.step('Add tags')
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
      cy.contains(category)
      cy.contains(tag1)
      cy.contains(tag2)

      cy.step('Edit question')
      cy.get('[data-cy=edit]')
        .click()
        .url()
        .should('include', `/questions/${initialExpectedSlug}/edit`)

      cy.step('Add title description')
      cy.get('[data-cy=field-description]')
        .clear()
        .type(updatedQuestionDescription, { delay: 0 })

      cy.step('Update images by removing one')
      cy.get('[data-cy=image-upload-0]')
        .get('[data-cy=delete-image]:first')
        .click({ force: true })

      cy.step('Updated question details shown')
      cy.get('[data-cy=submit]')
        .click()
        .url()
        .should('include', `/questions/${initialExpectedSlug}`)
      cy.contains(updatedQuestionDescription)

      cy.step('Updating the title changes the slug')
      cy.get('[data-cy=edit]').click()
      cy.get('[data-cy=field-title]').clear().type(updatedTitle).blur()
      cy.get('[data-cy=submit]')
        .click()
        .url()
        .should('include', `/questions/${updatedExpectedSlug}`)
      cy.contains(updatedTitle)

      cy.step('Can access the question with the previous slug')
      cy.visit(`/questions/${initialExpectedSlug}`)
      cy.contains(updatedTitle)

      cy.step('All updated fields visiable on list')
      cy.visit('/questions')
      cy.contains(updatedTitle)
      cy.contains(category)
    })
  })
})
