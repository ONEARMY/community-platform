describe('[How To]', () => {

  before(() => {
    cy.deleteDocuments('v2_howtos', 'title', '==', 'Create a how-to test')
  })

  describe('[Create a how-to]', () => {
    const fillStep = (stepNumber: number) => {
      const stepIndex = stepNumber - 1
      cy.step(`Filling step ${stepNumber}`)
      cy.get('[data-cy=step]')
        .eq(stepIndex)
        // carry out actions within the step matched above
        .within($step => {
          cy.get('[data-cy=step-title]').type(`Step ${stepNumber} is easy`)
          cy.get('[data-cy=step-description]').type(
            `Description for step ${stepNumber}`,
          )
          cy.get('[data-cy=step-caption]').type('What a step caption')
          cy.step('Upload pics for a step')
          cy.get(':file').uploadFiles([
            'images/howto-step-pic1.jpg',
            'images/howto-step-pic2.jpg',
          ])
        })
    }

    /**
     * Delete a given step number. Checks the total number of steps before and after
     * deletion, expecting number to decrease by 1
     * @param stepNumber - the number as indicated in the step title (>=1)
     */
    const deleteStep = (stepNumber: number) => {
      const stepIndex = stepNumber - 1
      cy.step(`Deleting step [${stepNumber}]`)
      cy.get('[data-cy=step]:visible').then(oldSteps => {
        cy.get('[data-cy=step]')
          .eq(stepIndex)
          .within($step => {
            cy.get('[data-cy=delete-step]').click()
          })
        cy.get('[data-cy=confirm]')
          .click()
          .then(() => {
            cy.get('[data-cy=step]:visible').then(newSteps => {
              expect(newSteps.length).to.eq(oldSteps.length - 1)
            })
          })
      })
    }

    it('[By Authenticated]', () => {
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
      cy.get('[data-cy=tag-select]').click()
      cy.get('.data-cy__menu')
        .contains('howto_testing')
        .click()
      cy.get('[data-cy=time-select]').click()
      cy.get('.data-cy__menu')
        .contains('1-2 weeks')
        .click()
      cy.get('[data-cy=difficulty-select]').click()
      cy.get('.data-cy__menu')
        .contains('Medium')
        .click()
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
      cy.get('[data-cy=tag-select]').click()
      cy.get('.data-cy__menu').contains('howto_testing').click()
    })
  })
})
