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

    cy.get('[data-cy=isContactable-true]').click({ force: true })
    cy.saveSettingsForm()

    cy.get('[data-cy=tab-Notifications]').click()
    cy.get('[data-cy=messages-link]').contains('Start receiving messages')
  })
})
