import { generateNewUserDetails } from '../../utils/TestUtils'

describe('[News]', () => {
  describe('[Create a news item]', () => {
    const initialTitle = 'Amazing new thing'
    const initialExpectedSlug = 'amazing-new-thing'
    const initialNewsBody =
      "We've done something so fantastic you wouldn't believe. But you can buy it soon."
    const category = 'Moulds'
    const tag1 = 'product'
    const tag2 = 'workshop'
    const updatedTitle = 'Still an amazing thing'
    const updatedExpectedSlug = 'still-an-amazing-thing'
    const updatedNewsBody = `${initialNewsBody} PLUS sparkles!`

    it('[By Authenticated]', () => {
      cy.visit('/news')
      const user = generateNewUserDetails()
      cy.signUpNewUser(user)

      cy.step("Can't add news with an incomplete profile")
      cy.visit('/news')
      cy.get('[data-cy=create-news]').should('not.exist')
      cy.get('[data-cy=complete-profile-news]').should('be.visible')
      cy.visit('/news/create')
      cy.get('[data-cy=incomplete-profile-message]').should('be.visible')
      cy.get('[data-cy=news-create-title]').should('not.exist')

      cy.completeUserProfile(user.username)

      cy.step('Can add a library project now profile is complete')
      cy.visit('/news')
      cy.get('[data-cy=complete-profile-news]').should('not.exist')
      cy.get('[data-cy=create-news]').click()

      cy.get('[data-cy=news-create-title]', { timeout: 20000 })

      // cy.step('Add images')
      // cy.get('[data-cy=image-upload-0]')
      //   .find(':file')
      //   .attachFile('images/howto-step-pic1.jpg')
      // cy.get('[data-cy=image-upload-1]')
      //   .find(':file')
      //   .attachFile('images/howto-step-pic2.jpg')

      cy.step('Add title field')
      cy.get('[data-cy=field-title]')
        .clear()
        .type(initialTitle)
        .blur({ force: true })

      cy.step('Add body')
      cy.get('[data-cy=field-body]').type(initialNewsBody, {
        delay: 0,
      })
      cy.step('Add category')
      cy.selectTag(category, '[data-cy=category-select]')

      cy.step('Add tags')
      cy.selectTag(tag1, '[data-cy="tag-select"]')
      cy.selectTag(tag2, '[data-cy="tag-select"]')

      cy.step('Submit news')
      cy.get('[data-cy=submit]')
        .click()
        .url()
        .should('include', `/news/${initialExpectedSlug}`)

      cy.step('All news fields visible')
      cy.contains(initialTitle)
      cy.contains(initialNewsBody)
      cy.contains(category)
      cy.contains(tag1)
      cy.contains(tag2)
      // contains images

      cy.step('Edit news')
      cy.get('[data-cy=edit]')
        .click()
        .url()
        .should('include', `/news/${initialExpectedSlug}/edit`)

      cy.step('Edit body')
      cy.get('[data-cy=field-body]').clear().type(updatedNewsBody, { delay: 0 })

      // cy.step('Update images by removing one')
      // cy.get('[data-cy=image-upload-0]')
      //   .get('[data-cy=delete-image]:first')
      //   .click({ force: true })

      cy.step('Updated news details shown')
      cy.get('[data-cy=submit]')
        .click()
        .url()
        .should('include', `/news/${initialExpectedSlug}`)
      cy.contains(updatedNewsBody)

      cy.step('Updating the title changes the slug')
      cy.get('[data-cy=edit]').click()
      cy.get('[data-cy=field-title]').clear().type(updatedTitle).blur()
      cy.get('[data-cy=submit]')
        .click()
        .url()
        .should('include', `/news/${updatedExpectedSlug}`)
      cy.contains(updatedTitle)

      // Bug: Missing previous slug functionality
      //
      // cy.step('Can access the news with the previous slug')
      // cy.visit(`/news/${initialExpectedSlug}`)
      // cy.contains(updatedTitle)

      cy.step('All updated fields visiable on list')
      cy.visit('/news')
      cy.contains(updatedTitle)
      cy.contains(category)
    })

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating a news')
      cy.visit('/news')
      cy.get('[data-cy=create-news]').should('not.exist')
      cy.get('[data-cy=sign-up]').should('be.visible')

      cy.visit('/news/create')
      cy.get('[data-cy=logged-out-message]').should('be.visible')
    })

    // it('[Admin]', () => {
    // Should check an admin can edit other's content
    // })
  })
})
