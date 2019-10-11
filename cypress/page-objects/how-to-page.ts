
export class HowToPage {
  constructor() {
    cy.visit('/how-to')
    cy.contains('Learn & share how to recycle, make and hack plastic')
  }

  goToCreatePage() {
    cy.visit('/how-to')
    cy.login('howto_creator@test.com', 'test1234')
    cy.get('[data-cy=create]').click()
  }
  create(title: string) {
    this.goToCreatePage()
    this.fillForm(title)

    cy.get('[data-cy=submit]')
      .should('not.be.disabled')
      .click()

    cy.wait(6000)
    cy.get('[data-cy=view-howto]').click()
  }

  fillForm(title: string) {
    this.fillIntro(title)
    this.fillStep(1)
    this.fillStep(2)
    this.deleteStep(3)
  }

  fillIntro(title: string) {
    cy.get('[data-cy=intro-title]')
      .type('Make glass-like beams')
      .blur({ force: true })
    cy.contains('Titles must be unique, please try being more specific',).should('exist')
    cy.step('Fill up the intro')
    cy.get('[data-cy=intro-title').type(title)
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
  }

  fillStep(stepNumber: number) {
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
  deleteStep(stepNumber: number) {
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

  addStep() {
    cy.step('Adding step')
    cy.get('[data-cy=step]:visible').then(oldSteps => {
      const oldStepCount = oldSteps.length
      cy.log('oldStepCount', oldStepCount)
      cy.get('button[data-cy=add-step]').click()
      cy.get('[data-cy=step]:visible').then(newSteps => {
        const newStepCount = newSteps.length
        expect(newStepCount).to.eq(oldStepCount + 1)
      })
    })
  }
}
