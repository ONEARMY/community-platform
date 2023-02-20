import { users } from '../data'

const { admin, mapview_testing_rejected } = users

context('map', () => {
  beforeEach(() => {
    cy.visit('/map')
  })
  it('should render an `accepted` pin', () => {
    cy.get('[class*="leaflet-marker-icon"]').should('exist')
  })

  describe('[By Admin]', () => {
    beforeEach(() => {
      cy.login(admin.email, admin.password)
    })

    it('should show option to moderate pins for admin users', () => {
      cy.visit('/map#settings_plastic_new')

      cy.get('[data-cy="MapMemberCard: accept"]').should('exist')
      cy.get('[data-cy="MapMemberCard: reject"]').should('exist')
    })

    it('should approve a map pin', () => {
      cy.visit('/map#settings_plastic_new')

      cy.get('[data-cy="MapMemberCard: accept"]').click()

      cy.get('[data-cy="MapMemberCard: moderation status"]').should('not.exist')
    })

    it('should delete a map pin', () => {
      cy.visit('/map#settings_workplace_new')

      cy.get('[data-cy="MapMemberCard: reject"]').click()

      setTimeout(() => {
        cy.get('[data-cy="MapMemberCard"]').should('not.exist')
      }, 1000)
    })
  })

  describe('[By User]', () => {
    it('should show the user a message stating their pin is rejected', () => {
      cy.login(
        mapview_testing_rejected.email,
        mapview_testing_rejected.password,
      )

      cy.visit(`/map#${mapview_testing_rejected._id}`)
      cy.get('[data-cy="MapMemberCard: moderation status"]').should('exist')
    })
  })
})
