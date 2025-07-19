import { users } from 'oa-shared/mocks/data'

import { generateAlphaNumeric } from '../../utils/TestUtils'

let initialRandomId

describe('[News.Write]', () => {
  describe('[Create a news item]', () => {
    beforeEach(() => {
      initialRandomId = generateAlphaNumeric(8).toLowerCase()
    })

    it('[By Authenticated]', () => {
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

      cy.visit('/news')
      const user = users.admin
      cy.signIn(user.email, user.password)

      cy.step("Can't add news from main page")
      cy.visit('/news')
      cy.get('[data-cy=create-news]').should('not.exist')

      cy.step('Can go direct to url')
      cy.visit('/news/create')
      cy.get('[data-cy=field-title]', { timeout: 20000 })

      cy.step('Cannot be published when empty')
      cy.get('[data-cy=submit]').click()
      cy.get('[data-cy=errors-container]')

      cy.step('Add image')
      cy.get('[data-cy=heroImage-upload]')
        .find(':file')
        .attachFile('images/howto-step-pic1.jpg')

      cy.step('Can add draft news')
      cy.get('[data-cy=field-title]')
        .clear()
        .type(initialTitle)
        .blur({ force: true })

      cy.addToMarkdownField(initialNewsBodyOne)
      cy.addToMarkdownField(initialNewsBodyTwo)
      cy.addToMarkdownField(initialNewsBodyThree)

      cy.get('[data-cy=draft]').click()
      cy.url().should('include', `/news/${initialExpectedSlug}`)

      cy.step('Can get to drafts')
      cy.visit('/news')
      cy.contains(initialTitle).should('not.exist')
      cy.get('[data-cy=my-drafts]').click()
      cy.contains(initialTitle).click()

      cy.step('Shows draft news')
      cy.get('[data-cy=draft-tag]').should('be.visible')
      cy.contains(initialNewsBodyOne)

      cy.step('Submit news')
      cy.get('[data-cy=edit]').click()

      cy.selectTag(category, '[data-cy=category-select]')
      cy.selectTag(tag1, '[data-cy="tag-select"]')
      cy.selectTag(tag2, '[data-cy="tag-select"]')

      cy.get('[data-cy=errors-container]').should('not.exist')
      cy.wait(2000)
      cy.get('[data-cy=submit]').click()

      cy.wait(2000)
      cy.url().should('include', `/news/${initialExpectedSlug}`)

      cy.step('All news fields shown')
      cy.visit('/news')
      cy.get('[data-cy=news-list-item-summary]')
        .first()
        .contains(initialSummary)
      cy.get('[data-cy=news-list-item]').contains(initialTitle).click()

      cy.contains(initialTitle)
      cy.contains(initialNewsBodyOne)
      cy.contains(initialNewsBodyTwo)
      cy.contains(initialNewsBodyThree)
      cy.contains(category)
      cy.contains(tag1)
      cy.contains(tag2)
      // contains images

      cy.step('All ready for a discussion')
      cy.contains('0 comments')
      cy.get('[data-cy=DiscussionTitle]').contains('Start the discussion')
      // Currently beta testers only:
      // cy.get('[data-cy=follow-button]').contains('Following Comments')

      cy.step('Edit fields')
      cy.wait(2000)
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
      cy.wait(2000)
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

      cy.step('Can access the news with the previous slug')
      cy.visit(`/news/${initialExpectedSlug}`)
      cy.contains(updatedTitle)

      cy.step('All updated fields visible on list')
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
