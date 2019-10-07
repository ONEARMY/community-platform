describe('FireBase + Cypress', () => {
  it('should logout and login', () => {

    cy.visit('/how-to')
    cy.logout()
    cy.get('[data-cy=create]').should('not.exist')

    cy.login('howto_reader@test.com', 'test1234')
    cy.get('[data-cy=create]').should('be.visible')

    cy.logout()
    cy.get('[data-cy=create]').should('not.exist')
  })

  it('should add/update/get/delete from FireStore', () => {
    cy.firestore().then(async firestore => {
      const addRef = await firestore
        .collection('testCollection')
        .add({ name: 'Tony Stark', age: 45 })
      console.log('Object added with ref ' + addRef.id)
      firestore
        .collection('testCollection')
        .doc(addRef.id)
        .update({ name: 'Iron man', age: 40 })
      console.log('Object updated ')
      const snapshot = await firestore.collection('testCollection').get()
      snapshot.forEach(doc => {
        console.log(`ID ${doc.id} => `, doc.data())
      })
      await firestore
        .collection('testCollection')
        .doc(addRef.id)
        .delete()
      console.log(`Object ${addRef.id} deleted`)
    })
    cy.visit('/how-to')
    cy.get('[data-cy=create]').should('not.exist')
  })
})
