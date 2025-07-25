import { UserRole } from 'oa-shared'

describe('[Notifications]', () => {
  it('email preferences can be set', () => {
    localStorage.setItem('devSiteRole', UserRole.BETA_TESTER)

    cy.signUpCompletedUser()
    cy.visit('/settings')

    cy.step('All ticked be default')
    cy.get('[data-cy=tab-Notifications]').click()
    cy.get('[data-cy=SupabaseNotifications-field-comments]').invoke(
      'prop',
      'indeterminate',
      true,
    )
    cy.get('[data-cy=SupabaseNotifications-field-comments]').click()
    cy.get('[data-cy=SupabaseNotifications-field-replies]').invoke(
      'prop',
      'indeterminate',
      true,
    )
    cy.get('[data-cy=SupabaseNotifications-field-replies]').click()

    cy.get('[data-cy=save-notifications-preferences]').click()

    cy.contains('Preferences updated')
    cy.get('[data-cy=SupabaseNotifications-field-comments]').invoke(
      'prop',
      'indeterminate',
      false,
    )
    cy.get('[data-cy=SupabaseNotifications-field-replies]').invoke(
      'prop',
      'indeterminate',
      false,
    )

    cy.step('Changing messaging updates preferences form')
    cy.get('[data-cy=messages-link]')
      .contains('Stop receiving messages')
      .click()

    cy.get('[data-cy=isContactableByPublic-true]').click({ force: true })
    cy.saveSettingsForm()

    cy.get('[data-cy=tab-Notifications]').click()
    cy.get('[data-cy=messages-link]').contains('Start receiving messages')
  })

  // Can't test like this now because we are now using the same users collection for all tests.
  // it('[are not generated when the howTo author is triggering notification]', () => {
  //   cy.visit('library')
  //   cy.signIn('event_reader@test.com', 'test1234')
  //   cy.visit('/library/testing-testing')
  //   cy.wait(2000)
  //   cy.get('[data-cy="vote-useful"]').contains('useful').click()
  //   cy.step('Verify the notification has not been added')
  //   cy.queryDocuments('users', 'userName', '==', 'event_reader').then(
  //     (docs) => {
  //       expect(docs.length).to.be.greaterThan(0)
  //       expect(docs[0]['notifications']).to.be.undefined
  //     },
  //   )
  // })

  // TODO: find out the issue and add it back
  // it('[are generated by clicking on useful for projects]', () => {
  //   cy.signUpNewUser(visitor)

  //   cy.visit('library')
  //   cy.visit('/library/testing-testing')
  //   cy.wait(DB_WAIT_TIME)
  //   cy.get('[data-cy="vote-useful"]').contains('useful').click()
  //   cy.wait(DB_WAIT_TIME)
  //   cy.step('Verify the notification has been added')
  //   cy.queryDocuments('users', 'userName', '==', 'event_reader').then(
  //     (docs) => {
  //       expect(docs.length).to.be.greaterThan(0)
  //       const [user] = docs
  //       const notifications = user['notifications']
  //       expect(notifications.length).to.be.greaterThan(0)

  //       const notification = notifications.find(
  //         ({ triggeredBy, type }) =>
  //           triggeredBy.userId === visitor.username && type === 'howto_useful',
  //       )
  //       expect(notification['type']).to.equal('howto_useful')
  //       expect(notification['relevantUrl']).to.equal('/library/testing-testing')
  //       expect(notification['read']).to.equal(false)
  //       expect(notification['triggeredBy']['displayName']).to.equal(
  //         visitor.username,
  //       )
  //     },
  //   )
  // })

  // TODO: find out the issue and add it back
  // it('[are generated by clicking on useful for research]', () => {
  //   cy.signUpNewUser(visitor)

  //   cy.visit('/research/qwerty')
  //   cy.wait(DB_WAIT_TIME)
  //   cy.get('[data-cy="vote-useful"]').contains('useful').click()
  //   cy.wait(DB_WAIT_TIME)
  //   cy.step('Verify the notification has been added')
  //   cy.queryDocuments('users', 'userName', '==', 'event_reader').then(
  //     (docs) => {
  //       expect(docs.length).to.be.greaterThan(0)
  //       const [user] = docs
  //       const notifications = user['notifications']
  //       expect(notifications.length).to.be.greaterThan(0)

  //       const notification = notifications.find(
  //         ({ triggeredBy }) => triggeredBy.userId === visitor.username,
  //       )

  //       expect(notification['relevantUrl']).to.equal('/research/qwerty')
  //       expect(notification['read']).to.equal(false)
  //       expect(notification['triggeredBy']['displayName']).to.equal(
  //         visitor.username,
  //       )
  //     },
  //   )
  // })

  it('[appear in notifications modal]', () => {
    cy.visit('library')
    cy.signIn('event_reader@test.com', 'test1234')
    cy.visit('/library/testing-testing')
    cy.get(
      '[data-cy="notifications-desktop"] [data-cy="toggle-notifications-modal"]',
    ).click()
    expect(cy.get('[data-cy="notification"]')).to.exist
  })

  it('[notifications modal is closed when clicking on the notifications icon for the second time or clicking on the header]', () => {
    cy.visit('library')
    cy.signIn('event_reader@test.com', 'test1234')
    cy.visit('/library/testing-testing')
    cy.get(
      '[data-cy="notifications-desktop"] [data-cy="toggle-notifications-modal"]',
    ).click()
    expect(cy.get('[data-cy="notifications-modal-desktop"]')).to.exist
    //click on the notifications button again
    cy.get(
      '[data-cy="notifications-desktop"] [data-cy="toggle-notifications-modal"]',
    ).click()
    cy.get('[data-cy="notifications-modal-desktop"]').should('not.exist')
    //click within the header area
    cy.get(
      '[data-cy="notifications-desktop"] [data-cy="toggle-notifications-modal"]',
    ).click()
    cy.get('[data-cy="header"]').click()
    cy.get('[data-cy="notifications-modal-desktop"]').should('not.exist')
  })

  // Commented as it is working, but very flaky
  // it('[are marked read when clicking on clear button]', () => {
  //   cy.visit('library')
  //   cy.signIn('event_reader@test.com', 'test1234')
  //   cy.visit('/library/testing-testing')
  //   cy.get(
  //     '[data-cy="notifications-desktop"] [data-cy="toggle-notifications-modal"]',
  //   ).click()
  //   cy.get('[data-cy="clear-notifications"]').click()
  //   cy.wait(DB_WAIT_TIME)
  //   cy.step('Verify the notification have been marked read')
  //   cy.queryDocuments('users', 'userName', '==', 'event_reader').then(
  //     (docs) => {
  //       expect(docs.length).to.be.greaterThan(0)
  //       const [user] = docs
  //       const notifications = user['notifications']
  //       expect(notifications.length).to.be.greaterThan(0)
  //       notifications.forEach((n) => {
  //         expect(n['read']).to.be.true
  //       })
  //     },
  //   )
  //   cy.get('[data-cy="NotificationList: empty state"]').should('be.visible')
  // })
})
