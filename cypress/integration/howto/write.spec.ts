describe('[How To]', () => {

  const selectTimeDuration = (duration: '<1 week'| '1-2 weeks' | '3-4 weeks') => {
    cy.get('[data-cy=time-select]').click()
    cy.get('.data-cy__menu')
      .contains(duration)
      .click()
  }
  const selectDifficultLevel = (difficultLevel: 'Easy' | 'Medium' | 'Hard' | 'Very Hard') => {
    cy.get('[data-cy=difficulty-select]').click()
    cy.get('.data-cy__menu')
      .contains(difficultLevel)
      .click()
  }

  const selectTag = (tag: string) => {
    cy.get('[data-cy=tag-select]').click()
    cy.get('.data-cy__menu')
      .contains(tag)
      .click()
  }

  const fillStep = (stepNumber: number) => {
    const stepIndex = stepNumber - 1
    cy.step(`Filling step ${stepNumber}`)
    cy.get(`[data-cy=step_${stepIndex}]:visible`)
      .within(($step) => {
        cy.get('[data-cy=step-title]').clear().type(`Step ${stepNumber} is easy`)
        cy.get('[data-cy=step-description]').clear().type(`Description for step ${stepNumber}`)
        cy.get('[data-cy=step-caption]').clear().type('What a step caption')
        cy.step('Uploading pics')
        const hasExistingPics = Cypress.$($step).find('[data-cy=delete-step-img]').length > 0
        if (hasExistingPics) {
          cy.wrap($step).find('[data-cy=delete-step-img]').each($deleteButton => {
            cy.wrap($deleteButton).click()
          })
        }
        cy.get(':file').uploadFiles([
          'images/howto-step-pic1.jpg',
          'images/howto-step-pic2.jpg',
        ])
      })
  }

  const deleteStep = (stepNumber: number) => {
    const stepIndex = stepNumber - 1
    cy.step(`Deleting step [${stepNumber}]`)
    cy.get(`[data-cy=step_${stepIndex}]:visible`).find('[data-cy=delete-step]').click()
    cy.get('[data-cy=confirm]').click()
  }

  describe('[Create a how-to]', () => {
    it('[By Authenticated]', () => {
      cy.deleteDocuments('v2_howtos', 'title', '==', 'Create a how-to test')
      cy.login('howto_creator@test.com', 'test1234')
      cy.step('Access the create-how-to page with its url')
      cy.visit('/how-to/create')

      cy.step('Warn if title is identical with the existing ones')
      cy.get('[data-cy=intro-title]')
        .type('Make glass-like beams')
        .blur({ force: true })
      cy.contains(
        'Titles must be unique, please try being more specific',
      ).should('exist')

      cy.step('Fill up the intro')
      cy.get('[data-cy=intro-title')
        .clear()
        .type('Create a how-to test')
      selectTag('howto_testing')
      selectTimeDuration('1-2 weeks')
      selectDifficultLevel('Medium')

      cy.get('[data-cy=intro-description]').type(
        'After creating, the how-to will be deleted',
      )
      cy.get('[data-cy=intro-caption]').type('Intro caption goes here ...')
      cy.step('Upload a cover for the intro')
      cy.get('[data-cy=intro-cover]')
        .find(':file')
        .uploadFiles('images/howto-intro.jpg')

      fillStep(1)
      fillStep(2)
      deleteStep(3)

      cy.get('[data-cy=header]').click({ force: true})
      cy.get('[data-cy=submit]').click()

      cy.wait(6000)
      cy.get('[data-cy=view-howto]')
        .click()
        .url()
        .should('include', `/how-to/create-a-howto-test`)
    })

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating an how-to')
      cy.logout()
      cy.visit('/how-to/create')
      cy.get('div').contains('Please login to access this page')
    })
  })

  describe('[Edit a how-to]', () => {
    const editHowtoUrl = '/how-to/set-up-devsite-to-help-coding/edit'
    it('[By Anonymous]', () => {
      cy.step('Redirect to Home Page after visiting an url')
      cy.logout()
      cy.visit(editHowtoUrl)
      cy.url().should('not.include', editHowtoUrl)
    })

    it('[By Authenticated]', () => {
      cy.visit('/how-to')
      cy.login('howto_creator@test.com', 'test1234')

      cy.visit(editHowtoUrl)
      cy.url().should('not.include', editHowtoUrl)
    })

    it('[By Owner]', () => {
      cy.visit('/how-to')
      cy.completeLogin('howto_editor@test.com', 'test1234')
      cy.step('Go to Edit mode')
      cy.visit(editHowtoUrl)
      cy.get('[data-cy=edit]').click()

      cy.step('Update the intro')
      cy.get('[data-cy=intro-title]').clear().type('This is an edit test')
      selectTag('howto_testing')
      selectTimeDuration('3-4 weeks')
      selectDifficultLevel('Hard')
      cy.get('[data-cy=intro-description]').clear().type('After editing, all changes are reverted')
      cy.get('[data-cy=intro-caption]').clear().type('Caption edited!')

      cy.step('Update a new cover for the intro')
      cy.get('[data-cy=intro-cover]').find('button[data-cy=delete]').click()
      cy.get('[data-cy=intro-cover]').find(':file').uploadFiles('images/howto-intro.jpg')


      deleteStep(5)
      deleteStep(4)
      deleteStep(2)
      fillStep(1)
      fillStep(2)

      cy.get('[data-cy=submit]').click()

      cy.step('Open the updated how-to')
      cy.wait(6000)
      cy.get('[data-cy=view-howto]').click()
        .url().should('include', '/how-to/this-is-an-edit-test')
      cy.get('[data-cy=how-to-basis]').contains('This is an edit test')
    })
  })
})
