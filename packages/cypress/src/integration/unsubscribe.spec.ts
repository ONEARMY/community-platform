import { MOCK_DATA } from '../data'
import { DbCollectionName } from '../utils/TestUtils'

context('unsubscribe', () => {
  const betaTester = MOCK_DATA.users['beta-tester']

  beforeEach(() => {
    cy.visit(`/unsubscribe/${betaTester.unsubscribeToken}`)
  })

  it('should render Unsubscribe page', () => {
    cy.get('[data-cy=unsubscribe]').should('exist')
  })

  it('should unsubscribe user', () => {
    cy.contains('You have been unsubscribed.')
    cy.queryDocuments(
      DbCollectionName.users,
      'userName',
      '==',
      betaTester.userName,
    ).then((docs) => {
      cy.log('queryDocs', docs)
      expect(docs.length).to.equal(1)
      cy.wrap(null)
        .then(() => docs[0].notification_settings)
        .should('deep.equal', { emailFrequency: 'never' })
    })
  })
})
