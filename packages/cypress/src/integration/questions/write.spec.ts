import {
  generateAlphaNumeric,
  generateNewUserDetails,
} from '../../utils/TestUtils'

let initialRandomId

describe('[Question]', () => {
  beforeEach(() => {
    initialRandomId = generateAlphaNumeric(8).toLowerCase()
  })

  describe('[Create a question]', () => {
    it('[By Authenticated]', () => {
      const initialTitle = initialRandomId + ' Health cost of plastic?'
      const initialExpectedSlug = initialRandomId + '-health-cost-of-plastic'
      const initialQuestionDescription =
        "Hello! I'm wondering how people feel about the health concerns about working with melting plastic and being in environments with microplastics. I have been working with recycling plastic (hdpe) for two years now, shredding and injection molding and haven't had any bad consequences yet. But with the low knowledge around micro plastics and its effects on the human body, and many concerns and hypotheses I have been a bit concerned lately.So I would like to ask the people in this community how you are feeling about it, and if you have experienced any issues with the microplastics or gases yet, if so how long have you been working with it? And what extra steps do you take to be protected from it? I use a gas mask with dust filters"
      const category = 'Moulds'
      // const tag1 = 'product'
      // const tag2 = 'workshop'
      const updatedRandomId = generateAlphaNumeric(8).toLowerCase()
      const updatedTitle = updatedRandomId + ' Real health cost of plastic?'
      const updatedExpectedSlug =
        updatedRandomId + '-real-health-cost-of-plastic'
      const updatedQuestionDescription = `${initialQuestionDescription} and super awesome goggles`

      cy.visit('/questions')
      const user = generateNewUserDetails()
      cy.signUpNewUser(user)

      cy.step("Can't add question with an incomplete profile")
      cy.visit('/questions')
      cy.get('[data-cy=create-question]').should('not.exist')
      cy.get('[data-cy=complete-profile-question]').should('be.visible')
      cy.visit('/questions/create')
      cy.get('[data-cy=incomplete-profile-message]').should('be.visible')
      cy.get('[data-cy=field-title]').should('not.exist')

      cy.completeUserProfile(user.username)

      cy.step('Can add a library project now profile is complete')
      cy.visit('/questions')
      cy.get('[data-cy=complete-profile-question]').should('not.exist')
      cy.get('[data-cy=create-question]:visible').click()

      cy.get('[data-cy=field-title]', { timeout: 20000 })

      cy.step('Cannot be published when empty')
      cy.get('[data-cy=submit]').click()
      cy.get('[data-cy=errors-container]')

      cy.step('Add image')
      cy.get('[data-cy=image-upload-0]')
        .find(':file')
        .attachFile('images/howto-step-pic1.jpg')

      cy.step('Add title field')
      cy.get('[data-cy=field-title]')
        .clear()
        .type(initialTitle)
        .blur({ force: true })

      cy.step('Add title description')
      cy.get('[data-cy=field-description]').type(initialQuestionDescription, {
        delay: 0,
      })

      cy.get('[data-cy=draft]').click()
      cy.url().should('include', `/questions/${initialExpectedSlug}`)

      cy.step('Can get to drafts')
      cy.visit('/questions')
      cy.contains(initialTitle).should('not.exist')
      cy.get('[data-cy=my-drafts]:visible').click()
      cy.contains(initialTitle).click()

      cy.step('Shows draft question')
      cy.get('[data-cy=draft-tag]').should('be.visible')
      cy.contains(initialQuestionDescription)
      cy.get('[data-cy=edit]').click()

      cy.step('Add category')
      cy.selectTag(category, '[data-cy=category-select]')

      // Bug: Tags missing in test suite setup
      //
      // cy.step('Add tags')
      // cy.selectTag(tag1, '[data-cy="tag-select"]')
      // cy.selectTag(tag2, '[data-cy="tag-select"]')

      cy.step('Submit question')
      cy.get('[data-cy=submit]').click()

      cy.url().should('include', `/questions/${initialExpectedSlug}`)

      cy.step('All question fields visible')
      cy.contains(initialTitle)
      cy.contains(initialQuestionDescription)
      cy.contains(category)
      // cy.contains(tag1)
      // cy.contains(tag2)
      // contains images

      cy.step('All ready for a discussion')
      cy.contains('0 comments')
      cy.get('[data-cy=DiscussionTitle]').contains('Start the discussion')
      cy.get('[data-cy=follow-button]').contains('Following')

      cy.step('Edit question')
      cy.get('[data-cy=edit]')
        .click()
        .url()
        .should('include', `/questions/${initialExpectedSlug}/edit`)

      cy.step('Add title description')
      cy.get('[data-cy=field-description]')
        .clear()
        .type(updatedQuestionDescription, { delay: 0 })

      // cy.step('Update images by removing one')
      // cy.get('[data-cy=image-upload-0]')
      //   .get('[data-cy=delete-image]:first')
      //   .click({ force: true })

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

      cy.step('All updated fields visible on list')
      cy.visit('/questions')
      cy.contains(updatedTitle)
      cy.contains(category)
    })

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating a question')
      cy.visit('/questions')
      cy.get('[data-cy=create-question]').should('not.exist')
      cy.get('[data-cy=sign-up]').should('be.visible')

      cy.visit('/questions/create')
      cy.url().should('contain', '/sign-in?returnUrl=%2Fquestions%2Fcreate')
    })

    // it('[Admin]', () => {
    // Should check an admin can edit other's content
    // })
  })
})
