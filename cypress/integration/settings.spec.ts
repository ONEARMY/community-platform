import { DbCollectionName, Page } from '../utils/test-utils'
import { UserMenuItem } from '../support/commands'

interface Info  {
  username: string,
  country: string
  description: string,
  coverImages: string[]
}

interface Link {
  /**
   * Start from 0
   */
  index: number,
  type: 'email' | 'website' | 'discord' | 'bazar' | 'forum' | 'social media'
  url: string
}

interface MapPin {
  description: string
  searchKeyword: string
  locationName: string
}

describe('[Settings]', () => {
  const selectFocus = (focus: string) => {
    cy.get(`[data-cy=${focus}]`).click()
  }

  const setInfo = (info : Info)=> {
    cy.step('Update Info section')
    cy.get('[data-cy=username').clear().type(info.username)
    cy.get('[data-cy=country]').find('.flag-select').click()
    cy.get('[data-cy=country]').find(':text').type(info.country.substring(0, info.country.length - 2))
    cy.get('[data-cy=country]').contains(info.country).click()
    cy.get('[data-cy=info-description').clear().type(info.description)
    cy.get('[data-cy=cover-images]').find(':file').uploadFiles(info.coverImages)
  }
  const setMapPin = (mapPin: MapPin) => {
    cy.step('Update Map section')
    cy.get('[data-cy=pin-description]').type(mapPin.description)
    cy.get('[data-cy=location]').find(':text').type(mapPin.searchKeyword)
    cy.get('[data-cy=location]').contains(mapPin.locationName).click()
  }

  const addContactLink = (link: Link) => {
    if (link.index > 0) {
      cy.get('[data-cy=add-link]').click()
    }

    cy.get(`[data-cy=select-link-${link.index}]`).click()
    cy.get(`[data-cy=select-link-${link.index}]`)
      .contains(link.type)
      .click()
    cy.get(`[data-cy=input-link-${link.index}]`).type(link.url)
  }

  describe('[Focus Workplace]', () => {
    const freshSettings = {
      _authID: 'l9N5HFHzSjQvtP9g9MyFnPpkFmM2',
      _id: 'settings_workplace_new',
      userName: 'settings_workplace_new',
      _deleted: false,
      verified: true,
    }

    const expected = {
      _authID: 'l9N5HFHzSjQvtP9g9MyFnPpkFmM2',
      _deleted: false,
      _id: 'settings_workplace_new',
      about: 'We have some space to run a workplace',
      country: 'United States',
      coverImages: [
        {
          contentType: 'image/jeg',
          fullPath:
            'uploads/v2_users/settings_workplace_new/images/profile-cover-1.jpg',
          name: 'profile-cover-1.jpg',
          size: 18987,
          type: 'image/jpeg',
        },
        {
          contentType: 'image/jpeg',
          fullPath:
            'uploads/v2_users/settings_workplace_new/images/profile-cover-2.jpg',
          name: 'profile-cover-2.jpg',
          size: 20619,
          type: 'image/jpeg',
        },
      ],
      links: [
        {
          label: 'email',
          url: 'settings_workplace_new@test.com',
        },
        {
          label: 'website',
          url: 'www.settings_workplace_new.com',
        },
      ],
      location: {
        administrative: 'Ohio',
        country: 'United States of America',
        countryCode: 'us',
        latlng: {
          lat: 39.9623,
          lng: -83.0007,
        },
        name: 'Columbus',
        postcode: '43085',
        value: 'Columbus, Ohio, United States of America',
      },
      mapPinDescription: "Come in & let's make cool stuff out of plastic!",
      openingHours: [
        {
          day: '',
          openFrom: '',
          openTo: '',
        },
      ],
      profileType: 'workspace',
      userName: 'settings_workplace_new',
      verified: true,
      workspaceType: 'shredder',
    }

    it('[Editing a new Profile]', () => {
      cy.logout()
      cy.updateDocument(
        DbCollectionName.v2_users,
        freshSettings.userName,
        freshSettings,
      )
      cy.visit(Page.EVENTS)
      cy.login('settings_workplace_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus(expected.profileType)
      cy.get(`[data-cy=${expected.workspaceType}]`).click()

      setInfo({username: expected.userName, country: expected.country, description: expected.about, coverImages: [
          'images/profile-cover-1.jpg',
          'images/profile-cover-2.jpg',
        ]})

      cy.step('Update Contact Links')
      addContactLink({index: 0, type: 'email', url: `${freshSettings.userName}@test.com`})
      addContactLink({index: 1, type: 'website', url: `www.${freshSettings.userName}.com`})

      setMapPin({description: expected.mapPinDescription, searchKeyword: 'ohio', locationName: expected.location.name})

      cy.get('[data-cy=save]').click().wait(3000)

      cy.step('Verify if all changes were saved correctly')
      cy.queryDocuments(DbCollectionName.v2_users, 'userName', '==', expected.userName).should('eqSettings', expected)
    })

  })
  describe('[Focus Member]', () => {
    const freshSettings = {
      _authID: 'pbx4jStD8sNj4OEZTg4AegLTl6E3',
      _id: 'settings_member_new',
      userName: 'settings_member_new',
      _deleted: false,
      verified: true,
    }
    it('[Edit a new profile]', () => {
      cy.visit(Page.EVENTS)
      cy.updateDocument(
        DbCollectionName.v2_users,
        freshSettings.userName,
        freshSettings,
      )
      cy.login('settings_member_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus('member')

      setInfo({username: freshSettings.userName, country: 'Poland', description: `I'm a very active member`, coverImages: [
          'images/profile-cover-1.jpg',
          'images/profile-cover-2.jpg',
        ]})
      cy.step('Update Contact Links')
      addContactLink({index: 0, type: 'email', url: `${freshSettings.userName}@test.com`})

      cy.get('[data-cy=save]').click().wait(3000)
    })

  })

  describe('[Focus Machine Builder]', () => {
    const freshSettings =     {
      "_authID": "wwtBAo7TrkSQ9nAaBN3D93I1sCM2",
      "_id": "settings_machine_new",
      "userName": "settings_machine_new",
      "_deleted": false,
      "verified": true
    }
    it('[Edit a new profile]', () => {
      cy.visit(Page.EVENTS)
      cy.updateDocument(
        DbCollectionName.v2_users,
        freshSettings.userName,
        freshSettings,
      )
      cy.login('settings_machine_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus('machine-builder')

      setInfo({username: freshSettings.userName, country: 'Singapore', description: `We're mechanics and our jobs are making machines`, coverImages: [
          'images/profile-cover-1.jpg'
        ]})

      cy.step('Choose Expertise')
      cy.get('[data-cy=electronics]').click()
      cy.get('[data-cy=welding]').click()

      cy.step('Update Contact Links')
      addContactLink({index: 0, type: 'bazar', url: `${freshSettings.userName}@test.com`})
      setMapPin({description: 'Informative workshop on machines every week', searchKeyword: 'singapo', locationName: 'Singapore'})

      cy.get('[data-cy=save]').click().wait(3000)
    })

  })
  
  describe('[Focus Community Builder]', () => {
    const freshSettings = {
      _authID: 'vWAbQvq21UbvhGldakIy1x4FpeF2',
      _id: 'settings_community_new',
      userName: 'settings_community_new',
      _deleted: false,
      verified: true,
    }
    
    it('[Edit a new profile]', () => {
      cy.visit(Page.EVENTS)
      cy.updateDocument(
        DbCollectionName.v2_users,
        freshSettings.userName,
        freshSettings,
      )
      cy.login('settings_community_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus('community-builder')

      setInfo({username: freshSettings.userName, country: 'United Kingdom', description: `An enthusiastic community that makes the world greener!`, coverImages: [
          'images/profile-cover-1.jpg',
          'images/profile-cover-2.jpg'
        ]})

      cy.step('Update Contact Links')
      addContactLink({index: 0, type: 'forum', url: `www.${freshSettings.userName}-forum.org`})
      setMapPin({description: 'Fun, vibrant and full of amazing people', searchKeyword: 'london', locationName: 'London'})

      cy.get('[data-cy=save]').click().wait(3000)
    })
  })
  
  describe('Focus Plastic Collection Point', () => {
    const freshSettings = {
      _authID: 'uxupeYR7glagQyhBy8q0blr0chd2',
      _id: 'settings_plastic_new',
      userName: 'settings_plastic_new',
      _deleted: false,
      verified: true,
    }
    interface OpeningTime {
      index: number
      day: string,
      from: string,
      to: string
    }
    const selectOption = (selector:string, selectedValue: string) => {
      cy.get(selector).click()
      cy.get('.data-cy__menu').contains(selectedValue).click()
    }

    const addOpeningTime = (openingTime: OpeningTime) => {
      if (openingTime.index > 0) {
        cy.get('[data-cy=add-opening-time]').click()
      }
      selectOption(`[data-cy=opening-time-day-${openingTime.index}]`, openingTime.day)
      selectOption(`[data-cy=opening-time-from-${openingTime.index}]`, openingTime.from)
      selectOption(`[data-cy=opening-time-to-${openingTime.index}]`, openingTime.to)
    }

    const deleteOpeningTime = (index: number, confirmed: boolean) => {
      cy.get(`[data-cy=delete-opening-time-${index}]`).click()
      if (confirmed) {
        cy.get('[data-cy=confirm-delete]').click()
      } else {
        cy.get('[data-cy=cancel-delete]').click()
      }
    }

    it('[Edit a new profile]', () => {
      cy.visit(Page.EVENTS)
      cy.updateDocument(
        DbCollectionName.v2_users,
        freshSettings.userName,
        freshSettings,
      )
      cy.login('settings_plastic_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus('collection-point')

      setInfo({username: freshSettings.userName, country: 'Japan', description: `We accept plastic currencies: Bottle, Nylon Bags, Plastic Lids/Straws`, coverImages: [
          'images/profile-cover-1.jpg',
          'images/profile-cover-2.jpg'
        ]})

      cy.step('Update Contact Links')
      addContactLink({index: 0, type: 'social media', url: `www.facebook.com/${freshSettings.userName}`})
      addContactLink({index: 1, type: 'social media', url: `www.twitter.com/${freshSettings.userName}`})

      cy.step('Update Collection section')
      addOpeningTime({index: 0, day: 'Monday', from: '09:00 AM', to: '06:00 PM'})
      addOpeningTime({index: 1, day: 'Tuesday', from: '09:00 AM', to: '06:00 PM'})
      addOpeningTime({index: 2, day: 'Wednesday', from: '09:00 AM', to: '06:00 PM'})
      addOpeningTime({index: 3, day: 'Friday', from: '09:00 AM', to: '06:00 PM'})
      deleteOpeningTime(0, false)
      deleteOpeningTime(1, true)


      cy.get('[data-cy=plastic-hdpe]').click()
      cy.get('[data-cy=plastic-pvc]').click()
      cy.get('[data-cy=plastic-other]').click()

      setMapPin({description: 'Feed us plastic!', searchKeyword: 'Kyoto', locationName: 'Maizuru'})

      cy.get('[data-cy=save]').click().wait(3000)
    })
  })
})
