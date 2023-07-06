describe('[Research]', () => {
  beforeEach(() => {
    cy.visit('/research')
  })

  const expected = {
    _createdBy: 'research_creator',
    _deleted: false,
    description: 'After creating, the research will be deleted',
    title: 'Create research article test',
    slug: 'create-research-article-test',
    previousSlugs: ['create-research-article-test'],
  }

  describe('[Create research article]', () => {
    it('[By Authenticated]', () => {
      cy.login('research_creator@test.com', 'research_creator')
      cy.wait(2000)
      cy.step('Create the research article')
      cy.get('[data-cy=create]').click()
      cy.step('Warn if title is identical to an existing one')
      cy.get('[data-cy=intro-title]').type('qwerty').blur({ force: true })
      cy.contains(
        'Titles must be unique, please try being more specific',
      ).should('exist')

      cy.step('Enter research article details')
      cy.get('[data-cy=intro-title')
        .clear()
        .type('Create research article test')
        .blur({ force: true })

      cy.get('[data-cy=intro-description]').type(expected.description)

      cy.screenClick()
      cy.get('[data-cy=submit]').click()

      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 })
        .click()
        .url()
        .should('include', `/research/${expected.slug}`)

      cy.step('Research article was created correctly')
      cy.queryDocuments('research', 'title', '==', expected.title).then(
        (docs) => {
          cy.log('queryDocs', docs)
          expect(docs.length).to.equal(1)
          cy.wrap(null)
            .then(() => docs[0])
            .should('eqResearch', expected)
        },
      )
    })

    it('[By Anonymous]', () => {
      cy.step('Ask users to login before creating a research item')
      cy.visit('/research/create')
      cy.get('div').contains('beta-tester role required to access this page')
    })

    it('[Warning on leaving page]', () => {
      const stub = cy.stub()
      stub.returns(false)
      cy.on('window:confirm', stub)

      cy.login('research_creator@test.com', 'research_creator')
      cy.wait(2000)
      cy.step('Access the create research article')
      cy.get('[data-cy=create]').click()
      cy.get('[data-cy=intro-title')
        .clear()
        .type('Create research article test')
        .blur({ force: true })
      cy.get('[data-cy=page-link][href*="/research"]')
        .click()
        .then(() => {
          expect(stub.callCount).to.equal(1)
          stub.resetHistory()
        })
      cy.url().should('match', /\/research\/create$/)

      cy.step('Clear title input')
      cy.get('[data-cy=intro-title').clear().blur({ force: true })
      cy.get('[data-cy=page-link][href*="/research"]')
        .click()
        .then(() => {
          expect(stub.callCount).to.equal(0)
          stub.resetHistory()
        })
      cy.url().should('match', /\/research$/)
    })
  })

  describe('[Edit a research article]', () => {
    const researchUrl = '/research/create-research-article-test'
    const editResearchUrl = '/research/create-research-article-test/edit'

    it('[By Anonymous]', () => {
      cy.step('Prevent anonymous access to edit research article')
      cy.visit(editResearchUrl)
      cy.get('[data-cy=auth-route-deny]').should('be.exist')
    })

    it('[By Authenticated]', () => {
      cy.step('Prevent non-owner access to edit research article')
      cy.visit('/research')
      cy.login('research_editor@test.com', 'research_editor')
      cy.visit(editResearchUrl)
      // user should be redirect to research page
      // cy.location('pathname').should('eq', researchUrl)
    })

    it('[By Owner]', () => {
      expected.title = `${expected.title} edited`
      expected.slug = `${expected.slug}-edited`
      expected.previousSlugs = [
        'create-research-article-test',
        'create-research-article-test-edited',
      ]
      cy.visit(researchUrl)
      cy.login('research_creator@test.com', 'research_creator')
      cy.step('Go to Edit mode')
      cy.get('[data-cy=edit]').click()

      cy.step('Warn if title is identical to an existing one')
      cy.get('[data-cy=intro-title]').focus().blur({ force: true })
      cy.wait(1000)
      cy.contains('qwerty').should('not.exist')

      cy.step('Update the intro')
      cy.get('[data-cy=intro-title]').clear().type(expected.title)

      cy.get('[data-cy=submit]').click()

      cy.step('Open the updated research article')

      cy.get('[data-cy=view-research]:enabled', { timeout: 20000 })
        .click()
        .url()
        .should('include', `${researchUrl}-edited`)
      cy.get('[data-cy=research-basis]').contains(expected.title)

      cy.queryDocuments('research', 'title', '==', expected.title).then(
        (docs) => {
          cy.log('queryDocs', docs)
          expect(docs.length).to.equal(1)
          cy.wrap(null)
            .then(() => docs[0])
            .should('eqResearch', expected)
        },
      )

      cy.step('Open the old slug')

      cy.visit(researchUrl)
      cy.get('[data-cy=research-basis]').contains(expected.title)
    })
  })
})
