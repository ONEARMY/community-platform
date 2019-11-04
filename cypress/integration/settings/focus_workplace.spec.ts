import { DbCollectionName, Page } from '../../utils/test-utils'

describe('[Settings]', () => {
  it('[Visit google]', () => {
    cy.visit('www.google.com')
  })
  it('[Visit Howto]', () => {
    cy.visit(Page.HOME_PAGE)
  })
  it('[Visit Event]', () => {
    cy.visit(Page.EVENTS)
  })

  describe('[Focus Workplace]', () => {
    const freshSettings = {
      _authID: 'l9N5HFHzSjQvtP9g9MyFnPpkFmM2',
      _id: 'settings_workplace_new',
      userName: 'settings_workplace_new',
      _deleted: false,
      _created: '2018-01-24T14:46:42.038Z',
      _modified: '2018-01-24T14:46:42.038Z',
      verified: true,
    }


    it('[Editing a new Profile]', () => {
      cy.visit('/')
      cy.updateDocument(
        DbCollectionName.v2_users,
        freshSettings.userName,
        freshSettings,
      )
    })
  })
})
