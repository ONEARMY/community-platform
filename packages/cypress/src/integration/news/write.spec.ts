import { users } from 'oa-shared/mocks/data'

import { generateAlphaNumeric } from '../../utils/TestUtils'

describe('[News.Write]', () => {
  describe('[Create a news item]', () => {
    const initialRandomId = generateAlphaNumeric(8).toLowerCase()

    const initialTitle = `${initialRandomId} Amazing new thing`
    const initialExpectedSlug = `${initialRandomId}-amazing-new-thing`
    const initialNewsBodyOne = 'Yo.'
    const initialNewsBodyTwo = "We've done something."
    const initialNewsBodyThree = 'We saved so much plastic.'
    const initialSummary = `${initialNewsBodyOne} ${initialNewsBodyTwo} ${initialNewsBodyThree}`
    const category = 'Moulds'
    const tag1 = 'product'
    const tag2 = 'workshop'
    const updatedTitle = `Still an amazing thing ${initialRandomId}`
    const updatedExpectedSlug = `still-an-amazing-thing-${initialRandomId}`
    const updatedNewsBody = 'PLUS sparkles!'
    const updatedSummary = `${updatedNewsBody} ${initialNewsBodyOne} ${initialNewsBodyTwo}`

    it('[By Authenticated]', () => {
      cy.visit('/news')
      const user = users.admin
      cy.signIn(user.email, user.password)

      cy.step("Can't add news with an incomplete profile")
      cy.visit('/news')
      cy.get('[data-cy=create-news]').should('not.exist')

      cy.step('Can add news now profile is complete')
      cy.visit('/news/create')
      cy.get('[data-cy=field-title]', { timeout: 20000 })

      // cy.step('Add images')
      // cy.get('[data-cy=image-upload-0]')
      //   .find(':file')
      //   .attachFile('images/howto-step-pic1.jpg')
      // cy.get('[data-cy=image-upload-1]')
      //   .find(':file')
      //   .attachFile('images/howto-step-pic2.jpg')

      cy.step('Add fields')
      cy.get('[data-cy=field-title]')
        .clear()
        .type(initialTitle)
        .blur({ force: true })

      cy.addToMarkdownField(initialNewsBodyOne)
      cy.addToMarkdownField(initialNewsBodyTwo)
      cy.addToMarkdownField(initialNewsBodyThree)

      cy.selectTag(category, '[data-cy=category-select]')

      cy.selectTag(tag1, '[data-cy="tag-select"]')
      cy.selectTag(tag2, '[data-cy="tag-select"]')

      cy.step('Submit news')
      cy.get('[data-cy=submit]').click()

      cy.url().should('include', `/news/${initialExpectedSlug}`)

      cy.step('All news fields shown')
      cy.visit('/news')
      cy.get('[data-cy=news-list-item-summary]')
        .first()
        .contains(initialSummary)
      cy.visit(`/news/${initialExpectedSlug}`)
      cy.contains(initialTitle)
      cy.contains(initialNewsBodyOne)
      cy.contains(initialNewsBodyTwo)
      cy.contains(initialNewsBodyThree)
      cy.contains(category)
      cy.contains(tag1)
      cy.contains(tag2)
      // contains images

      cy.step('Edit fields')
      cy.get('[data-cy=edit]')
        .click()
        .url()
        .should('include', `/news/${initialExpectedSlug}/edit`)

      cy.get('[data-cy=field-title]').clear().type(updatedTitle).blur()
      cy.get('.mdxeditor-root-contenteditable').type('{selectAll}{del}')

      cy.addToMarkdownField(updatedNewsBody)
      cy.addToMarkdownField(initialNewsBodyOne)
      cy.addToMarkdownField(initialNewsBodyTwo)
      cy.addToMarkdownField(initialNewsBodyThree)

      // cy.step('Update images by removing one')
      // cy.get('[data-cy=image-upload-0]')
      //   .get('[data-cy=delete-image]:first')
      //   .click({ force: true })

      cy.step('Updated news details shown')
      cy.get('[data-cy=submit]')
        .click()
        .url()
        .should('include', `/news/${updatedExpectedSlug}`)
      cy.contains(updatedNewsBody)

      cy.contains(updatedTitle)
      cy.contains(updatedNewsBody)
      cy.contains(initialNewsBodyOne)
      cy.contains(initialNewsBodyTwo)
      cy.contains(initialNewsBodyThree)

      // Bug: Missing previous slug functionality
      //
      // cy.step('Can access the news with the previous slug')
      // cy.visit(`/news/${initialExpectedSlug}`)
      // cy.contains(updatedTitle)

      cy.step('All updated fields visiable on list')
      cy.visit('/news')
      cy.contains(updatedSummary)
      cy.contains(updatedTitle)
      cy.contains(category)
    })

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating a news')
      cy.visit('/news')
      cy.get('[data-cy=create-news]').should('not.exist')

      cy.visit('/news/create')
      cy.url().should('contain', '/sign-in?returnUrl=%2Fnews%2Fcreate')
    })

    // it('[Admin]', () => {
    // Should check an admin can edit other's content
    // })
  })
})
