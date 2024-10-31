import { MOCK_DATA } from '../../data'
import { generateAlphaNumeric } from '../../utils/TestUtils'

const questions = Object.values(MOCK_DATA.questions)
const item = questions[0]

describe('[Question]', () => {
  describe('[Create a question]', () => {
    const initialRandomId = generateAlphaNumeric(8)
    const initialTitle = initialRandomId + ' Health cost of plastic?'
    const initialExpectedSlug = initialRandomId + '-health-cost-of-plastic'
    const initialQuestionDescription =
      "Hello! I'm wondering how people feel about the health concerns about working with melting plastic and being in environments with microplastics. I have been working with recycling plastic (hdpe) for two years now, shredding and injection molding and haven't had any bad consequences yet. But with the low knowledge around micro plastics and its effects on the human body, and many concerns and hypotheses I have been a bit concerned lately.So I would like to ask the people in this community how you are feeling about it, and if you have experienced any issues with the microplastics or gases yet, if so how long have you been working with it? And what extra steps do you take to be protected from it? I use a gas mask with dust filters"
    const category = 'exhibition'
    const tag1 = 'product'
    const tag2 = 'workshop'
    const updatedRandomId = generateAlphaNumeric(8)
    const updatedTitle = updatedRandomId + ' Real health cost of plastic?'
    const updatedExpectedSlug = updatedRandomId + '-real-health-cost-of-plastic'
    const updatedQuestionDescription = `${initialQuestionDescription} and super awesome goggles`

    it('[By Authenticated]', () => {
      cy.signUpNewUser()

      cy.step('Go to create page')
      cy.visit('/questions/create')
      cy.get('[data-cy=question-create-title]', { timeout: 20000 })

      cy.step('Warn if title is identical to an existing one')
      cy.get('[data-cy=field-title]').type(item.title).blur({ force: true })
      cy.contains(
        'Titles must be unique, please try being more specific',
      ).should('be.visible')

      cy.step('Add title field')
      cy.get('[data-cy=field-title]')
        .clear()
        .type(initialTitle)
        .blur({ force: true })

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

      // Commented out until test indexes issue solved
      //
      // cy.step('All updated fields visiable on list')
      // cy.visit('/questions')
      // cy.contains(updatedTitle)
      // cy.contains(category)
    })
  })
})
