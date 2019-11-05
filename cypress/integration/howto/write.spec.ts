describe('[How To]', () => {
  type Duration = '<1 week' | '1-2 weeks' | '3-4 weeks'
  type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Very Hard'

  const selectTimeDuration = (duration: Duration) => {
    cy.get('[data-cy=time-select]').click()
    cy.get('.data-cy__menu')
      .contains(duration)
      .click()
  }
  const selectDifficultLevel = (difficultLevel: Difficulty) => {
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

  const fillStep = (
    stepNumber: number,
    title: string,
    description: string,
    caption: string,
    images: string[],
  ) => {
    const stepIndex = stepNumber - 1
    cy.step(`Filling step ${stepNumber}`)
    cy.get(`[data-cy=step_${stepIndex}]:visible`).within($step => {
      cy.get('[data-cy=step-title]')
        .clear()
        .type(`Step ${stepNumber} is easy`)
      cy.get('[data-cy=step-description]')
        .clear()
        .type(`Description for step ${stepNumber}`)
      cy.get('[data-cy=step-caption]')
        .clear()
        .type('What a step caption')
      cy.step('Uploading pics')
      const hasExistingPics =
        Cypress.$($step).find('[data-cy=delete-step-img]').length > 0
      if (hasExistingPics) {
        cy.wrap($step)
          .find('[data-cy=delete-step-img]')
          .each($deleteButton => {
            cy.wrap($deleteButton).click()
          })
      }
      cy.get(':file').uploadFiles(images)
    })
  }

  const deleteStep = (stepNumber: number) => {
    const stepIndex = stepNumber - 1
    cy.step(`Deleting step [${stepNumber}]`)
    cy.get(`[data-cy=step_${stepIndex}]:visible`)
      .find('[data-cy=delete-step]')
      .click()
    cy.get('[data-cy=confirm]').click()
  }

  describe('[Create a how-to]', () => {
    const expected = {
      _createdBy: 'howto_creator',
      _deleted: false,
      caption: 'Intro caption goes here ...',
      description: 'After creating, the how-to will be deleted',
      difficulty_level: 'Medium',
      time: '1-2 weeks',
      title: 'Create a how-to test',
      slug: 'create-a-howto-test',
      files: [],
      tags: {
        jUtS7pVbv7DXoQyV13RR: true,
      },
      cover_image: {
        contentType: 'image/jpeg',
        name: 'howto-intro.jpg',
        size: 19897,
        type: 'image/jpeg',
      },
      steps: [
        {
          _animationKey: 'unique1',
          caption: 'What a step caption',
          images: [
            {
              contentType: 'image/jpeg',
              name: 'howto-step-pic1.jpg',
              size: 19410,
              type: 'image/jpeg',
            },
            {
              contentType: 'image/jpeg',
              name: 'howto-step-pic2.jpg',
              size: 20009,
              type: 'image/jpeg',
            },
          ],
          text: 'Description for step 1',
          title: 'Step 1 is easy',
        },
        {
          _animationKey: 'unique2',
          caption: 'What a step caption',
          images: [],
          text: 'Description for step 2',
          title: 'Step 2 is easy',
        },
      ],
    }

    it('[By Authenticated]', () => {
      cy.deleteDocuments('v2_howtos', 'title', '==', expected.title)
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
      selectTimeDuration(expected.time as Duration)
      selectDifficultLevel(expected.difficulty_level as Difficulty)

      cy.get('[data-cy=intro-description]').type(expected.description)
      cy.get('[data-cy=intro-caption]').type(expected.caption)
      cy.step('Upload a cover for the intro')
      cy.get('[data-cy=intro-cover]')
        .find(':file')
        .uploadFiles('images/howto-intro.jpg')

      expected.steps.forEach((step, index) => {
        fillStep(index + 1, step.title, step.text, step.caption, [
          'images/howto-step-pic1.jpg',
          'images/howto-step-pic2.jpg',
        ])
      })
      deleteStep(3)

      cy.screenClick()
      cy.get('[data-cy=submit]').click()

      cy.get('[data-cy=view-howto]:enabled')
        .click()
        .url()
        .should('include', `/how-to/create-a-howto-test`)

      cy.step('Howto was created correctly')
      cy.queryDocuments('v2_howtos', 'title', '==', expected.title).should(
        'eqHowto',
        expected,
      )
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
    const expected = {
      _createdBy: 'howto_editor',
      _deleted: false,
      caption: 'Caption edited!',
      description: 'After editing, all changes are reverted',
      difficulty_level: 'Hard',
      files: [],
      slug: 'this-is-an-edit-test',
      tags: { jUtS7pVbv7DXoQyV13RR: true },
      time: '3-4 weeks',
      title: 'This is an edit test',
      cover_image: {
        contentType: 'image/jpeg',
        name: 'howto-intro.jpg',
        size: 19897,
        type: 'image/jpeg',
      },
      steps: [
        {
          _animationKey: 'unique1',
          caption: 'What a step caption',
          images: [
            {
              contentType: 'image/jpeg',
              name: 'howto-step-pic1.jpg',
              size: 19410,
              type: 'image/jpeg',
            },
            {
              contentType: 'image/jpeg',
              name: 'howto-step-pic2.jpg',
              size: 20009,
              type: 'image/jpeg',
            },
          ],
          text: 'Description for step 1',
          title: 'Step 1 is easy',
        },
        {
          _animationKey: 'unique3',
          caption: 'What a step caption',
          images: [
            {
              contentType: 'image/jpeg',
              name: '3.1.jpg',
              size: 141803,
              type: 'image/jpeg',
            },
            {
              contentType: 'image/jpeg',
              name: '3.2.jpg',
              size: 211619,
              type: 'image/jpeg',
            },
            {
              contentType: 'image/jpeg',
              name: '3.4.jpg',
              size: 71309,
              type: 'image/jpeg',
            },
          ],
          text: 'Description for step 2',
          title: 'Step 2 is easy',
        },
      ],
    }

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
      cy.logout()
      cy.login('howto_editor@test.com', 'test1234')
      cy.step('Go to Edit mode')
      cy.visit(editHowtoUrl)
      cy.get('[data-cy=edit]').click()

      cy.step('Update the intro')
      cy.get('[data-cy=intro-title]')
        .clear()
        .type(expected.title)
      selectTag('howto_testing')
      selectTimeDuration(expected.time as Duration)
      selectDifficultLevel(expected.difficulty_level as Difficulty)
      cy.get('[data-cy=intro-description]')
        .clear()
        .type(expected.description)
      cy.get('[data-cy=intro-caption]')
        .clear()
        .type(expected.caption)

      cy.step('Update a new cover for the intro')
      cy.get('[data-cy=intro-cover]')
        .find('button[data-cy=delete]')
        .click()
      cy.get('[data-cy=intro-cover]')
        .find(':file')
        .uploadFiles('images/howto-intro.jpg')

      deleteStep(5)
      deleteStep(4)
      deleteStep(2)

      expected.steps.forEach((step, index) => {
        fillStep(index + 1, step.title, step.text, step.caption, [
          'images/howto-step-pic1.jpg',
          'images/howto-step-pic2.jpg',
        ])
      })

      cy.get('[data-cy=submit]').click()

      cy.step('Open the updated how-to')

      cy.get('[data-cy=view-howto]:enabled')
        .click()
        .url()
        .should('include', '/how-to/this-is-an-edit-test')
      cy.get('[data-cy=how-to-basis]').contains('This is an edit test')
      cy.queryDocuments(
        'v2_howtos',
        'title',
        '==',
        'This is an edit test',
      ).should('eqHowto', expected)
    })
  })
})
