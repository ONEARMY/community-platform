import { DbCollectionName, Page } from '../utils/test-utils'
import { UserMenuItem } from '../support/commands'

interface Info {
  username: string
  country?: string
  description: string
  coverImage: string
}

interface ILink {
  /**
   * Start from 0
   */
  index: number
  type: 'email' | 'website' | 'discord' | 'bazar' | 'forum' | 'social media'
  url: string
}

interface IMapPin {
  description: string
  searchKeyword: string
  locationName: string
}

describe('[Settings]', () => {
  const selectFocus = (focus: string) => {
    cy.get(`[data-cy=${focus}]`).click()
  }

  const setInfo = (info: Info) => {
    cy.step('Update Info section')
    cy.get('[data-cy=username')
      .clear()
      .type(info.username)
    if (info.country) {
      cy.get('[data-cy=country]')
        .find('.flag-select')
        .click()
      cy.get('[data-cy=country]')
        .find(':text')
        .type(info.country.substring(0, info.country.length - 2))
      cy.get('[data-cy=country]')
        .contains(info.country)
        .click()
    }
    cy.get('[data-cy=info-description')
      .clear()
      .type(info.description)
    cy.get('[data-cy=cover-image]')
      .find(':file')
      .uploadFiles(info.coverImage)
  }
  const setMapPin = (mapPin: IMapPin) => {
    cy.step('Update Map section')
    cy.get('[data-cy=pin-description]').type(mapPin.description)
    cy.get('[data-cy=location]')
      .find(':text')
      .type(mapPin.searchKeyword)
    cy.get('[data-cy=location]')
      .find('.ap-suggestion:eq(0)')
      .click()
    cy.get('[data-cy=location]')
      .find('input')
      .should('have.value', mapPin.locationName)
  }

  const addContactLink = (link: ILink) => {
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
      coverImages: [
        {
          contentType: 'image/jpeg',
          fullPath:
            'uploads/v3_users/settings_workplace_new/images/profile-cover-1.jpg',
          name: 'profile-cover-1.jpg',
          size: 18987,
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
          url: 'http://www.settings_workplace_new.com',
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
      profileType: 'workspace',
      userName: 'settings_workplace_new',
      verified: true,
      workspaceType: 'shredder',
    }

    it('[Editing a new Profile]', () => {
      cy.logout()
      cy.updateDocument(
        DbCollectionName.users,
        freshSettings.userName,
        freshSettings,
      )
      cy.visit(Page.EVENTS)
      cy.login('settings_workplace_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus(expected.profileType)
      cy.get(`[data-cy=${expected.workspaceType}]`).click()

      setInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.step('Update Contact Links')
      addContactLink({
        index: 0,
        type: 'email',
        url: `${freshSettings.userName}@test.com`,
      })
      addContactLink({
        index: 1,
        type: 'website',
        url: `www.${freshSettings.userName}.com`,
      })

      setMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'ohio',
        locationName: expected.location.value,
      })

      cy.get('[data-cy=save]')
        .click()
        .wait(3000)

      cy.step('Verify if all changes were saved correctly')
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).should('eqSettings', expected)
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

    const expected = {
      _authID: 'pbx4jStD8sNj4OEZTg4AegLTl6E3',
      _deleted: false,
      _id: 'settings_member_new',
      about: "I'm a very active member",
      country: 'Poland',
      profileType: 'member',
      userName: 'settings_member_new',
      verified: true,
      coverImages: [
        {
          contentType: 'image/jpeg',
          fullPath:
            'uploads/users/settings_member_new/images/profile-cover-1.jpg',
          name: 'profile-cover-1.jpg',
          size: 18987,
          type: 'image/jpeg',
        },
      ],
      links: [
        {
          label: 'email',
          url: 'settings_member_new@test.com',
        },
      ],
    }
    it('[Edit a new profile]', () => {
      cy.logout()
      cy.updateDocument(
        DbCollectionName.users,
        freshSettings.userName,
        freshSettings,
      )
      cy.visit(Page.EVENTS)

      cy.login('settings_member_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus(expected.profileType)

      setInfo({
        username: expected.userName,
        country: expected.country,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })
      cy.step('Update Contact Links')
      addContactLink({
        index: 0,
        type: 'email',
        url: `${freshSettings.userName}@test.com`,
      })

      cy.get('[data-cy=save]')
        .click()
        .wait(3000)

      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).should('eqSettings', expected)
    })
  })

  describe('[Focus Machine Builder]', () => {
    const freshSettings = {
      _authID: 'wwtBAo7TrkSQ9nAaBN3D93I1sCM2',
      _id: 'settings_machine_new',
      userName: 'settings_machine_new',
      _deleted: false,
      verified: true,
    }

    const expected = {
      _authID: 'wwtBAo7TrkSQ9nAaBN3D93I1sCM2',
      _deleted: false,
      _id: 'settings_machine_new',
      about: "We're mechanics and our jobs are making machines",
      profileType: 'machine-builder',
      userName: 'settings_machine_new',
      verified: true,
      coverImages: [
        {
          contentType: 'image/jpeg',
          fullPath:
            'uploads/users/settings_machine_new/images/profile-cover-1.jpg',
          name: 'profile-cover-1.jpg',
          size: 18987,
          type: 'image/jpeg',
        },
      ],
      links: [
        {
          label: 'bazar',
          url: 'http://settings_machine_bazarlink.com',
        },
      ],
      location: {
        administrative: 'Central Singapore',
        country: 'Singapore',
        countryCode: 'sg',
        latlng: {
          lat: 1.29048,
          lng: 103.852,
        },
        name: 'Singapore',
        postcode: '178957',
        value: 'Singapore, Central Singapore, Singapore',
      },
      mapPinDescription: 'Informative workshop on machines every week',
      machineBuilderXp: ['electronics', 'welding'],
    }

    it('[Edit a new profile]', () => {
      cy.logout()
      cy.updateDocument(
        DbCollectionName.users,
        freshSettings.userName,
        freshSettings,
      )
      cy.visit(Page.EVENTS)

      cy.login('settings_machine_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus(expected.profileType)

      setInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.step('Choose Expertise')
      cy.get('[data-cy=electronics]').click()
      cy.get('[data-cy=welding]').click()

      cy.step('Update Contact Links')
      addContactLink({
        index: 0,
        type: 'bazar',
        url: `http://settings_machine_bazarlink.com`,
      })
      setMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'singapo',
        locationName: expected.location.value,
      })

      cy.get('[data-cy=save]')
        .click()
        .wait(3000)

      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).should('eqSettings', expected)
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

    const expected = {
      _authID: 'vWAbQvq21UbvhGldakIy1x4FpeF2',
      _deleted: false,
      _id: 'settings_community_new',
      about: 'An enthusiastic community that makes the world greener!',
      mapPinDescription: 'Fun, vibrant and full of amazing people',
      profileType: 'community-builder',
      userName: 'settings_community_new',
      verified: true,
      coverImages: [
        {
          contentType: 'image/jpeg',
          fullPath:
            'uploads/v3_users/settings_community_new/images/profile-cover-1.jpg',
          name: 'profile-cover-1.jpg',
          size: 18987,
          type: 'image/jpeg',
        },
      ],
      links: [
        {
          label: 'forum',
          url: 'http://www.settings_community_new-forum.org',
        },
      ],
      location: {
        administrative: 'England',
        country: 'United Kingdom',
        countryCode: 'gb',
        latlng: {
          lat: 51.5073,
          lng: -0.127647,
        },
        name: 'City of London',
        postcode: 'EC1A',
        value: 'City of London, England, United Kingdom',
      },
    }

    it('[Edit a new profile]', () => {
      cy.logout()
      cy.updateDocument(
        DbCollectionName.users,
        freshSettings.userName,
        freshSettings,
      )
      cy.visit(Page.EVENTS)

      cy.login('settings_community_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus(expected.profileType)

      setInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.step('Update Contact Links')
      expected.links.forEach((link, index) =>
        addContactLink({ index, type: 'forum', url: link.url }),
      )

      setMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'london',
        locationName: expected.location.value,
      })

      cy.get('[data-cy=save]')
        .click()
        .wait(3000)
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).should('eqSettings', expected)
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

    const expected = {
      _authID: 'uxupeYR7glagQyhBy8q0blr0chd2',
      _deleted: false,
      _id: 'settings_plastic_new',
      about:
        'We accept plastic currencies: Bottle, Nylon Bags, Plastic Lids/Straws',
      profileType: 'collection-point',
      userName: 'settings_plastic_new',
      verified: true,
      coverImages: [
        {
          contentType: 'image/jpeg',
          fullPath:
            'uploads/v3_users/settings_plastic_new/images/profile-cover-1.jpg',
          name: 'profile-cover-1.jpg',
          size: 18987,
          type: 'image/jpeg',
        },
      ],
      links: [
        {
          label: 'social-media',
          url: 'http://www.facebook.com/settings_plastic_new',
        },
        {
          label: 'social-media',
          url: 'http://www.twitter.com/settings_plastic_new',
        },
      ],
      location: {
        administrative: 'Melaka',
        country: 'Malaysia',
        countryCode: 'my',
        latlng: {
          lat: 2.19082,
          lng: 102.256,
        },
        name: 'Malacca',
        postcode: '75000',
        value: 'Malacca, Melaka, Malaysia',
      },
      mapPinDescription: 'Feed us plastic!',
      openingHours: [
        {
          day: 'Monday',
          openFrom: '09:00 AM',
          openTo: '06:00 PM',
        },
        {
          day: 'Wednesday',
          openFrom: '09:00 AM',
          openTo: '06:00 PM',
        },
        {
          day: 'Friday',
          openFrom: '09:00 AM',
          openTo: '06:00 PM',
        },
      ],
      collectedPlasticTypes: ['hdpe', 'pvc', 'other'],
    }

    interface IOpeningTime {
      index: number
      day: string
      from: string
      to: string
    }
    const selectOption = (selector: string, selectedValue: string) => {
      cy.get(selector).click()
      cy.get('.data-cy__menu')
        .contains(selectedValue)
        .click()
    }

    const addOpeningTime = (openingTime: IOpeningTime) => {
      if (openingTime.index > 0) {
        cy.get('[data-cy=add-opening-time]').click()
      }
      selectOption(
        `[data-cy=opening-time-day-${openingTime.index}]`,
        openingTime.day,
      )
      selectOption(
        `[data-cy=opening-time-from-${openingTime.index}]`,
        openingTime.from,
      )
      selectOption(
        `[data-cy=opening-time-to-${openingTime.index}]`,
        openingTime.to,
      )
    }

    const deleteOpeningTime = (index: number, confirmed: boolean) => {
      cy.viewport('macbook-13')
      cy.get(`[data-cy=delete-opening-time-${index}-desk]`).click()
      if (confirmed) {
        cy.get('[data-cy=confirm-delete]').click()
      } else {
        cy.get('[data-cy=cancel-delete]').click()
      }
    }

    it('[Edit a new profile]', () => {
      cy.logout()
      cy.updateDocument(
        DbCollectionName.users,
        freshSettings.userName,
        freshSettings,
      )
      cy.visit(Page.EVENTS)
      cy.login('settings_plastic_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus(expected.profileType)

      setInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })

      cy.step('Update Contact Links')
      addContactLink({
        index: 0,
        type: 'social media',
        url: `www.facebook.com/${freshSettings.userName}`,
      })
      addContactLink({
        index: 1,
        type: 'social media',
        url: `www.twitter.com/${freshSettings.userName}`,
      })

      cy.step('Update Collection section')
      addOpeningTime({
        index: 0,
        day: 'Monday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      addOpeningTime({
        index: 1,
        day: 'Tuesday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      addOpeningTime({
        index: 2,
        day: 'Wednesday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      addOpeningTime({
        index: 3,
        day: 'Friday',
        from: '09:00 AM',
        to: '06:00 PM',
      })
      deleteOpeningTime(0, false)
      deleteOpeningTime(1, true)

      cy.get('[data-cy=plastic-hdpe]').click()
      cy.get('[data-cy=plastic-pvc]').click()
      cy.get('[data-cy=plastic-other]').click()

      setMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'Malacca',
        locationName: expected.location.value,
      })

      cy.get('[data-cy=save]')
        .click()
        .wait(3000)
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).should('eqSettings', expected)
    })
  })
})
