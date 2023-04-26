import { DbCollectionName } from '../utils/TestUtils'
import { UserMenuItem } from '../support/commands'
import type { IUser } from '../../../../src/models/user.models'
import { SingaporeStubResponse } from '../fixtures/searchResults'

interface Info {
  username: string
  country?: string
  description: string
  coverImage: string
}

interface IMapPin {
  description: string
  searchKeyword: string
  locationName: string
}
type ILink = IUser['links'][0] & { index: number }

describe('[Settings]', () => {
  beforeEach(() => {
    cy.visit('/sign-in')
  })
  const selectFocus = (focus: string) => {
    cy.get(`[data-cy=${focus}]`).click()
  }

  const setInfo = (info: Info) => {
    cy.step('Update Info section')
    cy.get('[data-cy=username').clear().type(info.username)
    cy.get('[data-cy=info-description').clear().type(info.description)
    cy.get('[data-cy=coverImages-0]').find(':file').attachFile(info.coverImage)
  }
  const setWorkspaceMapPin = (mapPin: IMapPin) => {
    cy.step('Update Workspace Map section')
    cy.get('[data-cy=pin-description]').clear().type(mapPin.description)
    cy.get('[data-cy="osm-geocoding-input"]').clear().type(mapPin.searchKeyword)
    cy.get('[data-cy="osm-geocoding-results"]')
    cy.wait('@fetchAddress').then(() => {
      cy.get('[data-cy="osm-geocoding-results"]').find('li:eq(0)').click()
    })

    cy.get('[data-cy="osm-geocoding-input"]').should(($input) => {
      const val = $input.val()

      expect(val).to.include(mapPin.locationName)
    })
  }

  const setMemberMapPin = (mapPin: IMapPin) => {
    cy.step('Update Member section')
    cy.get('[data-cy=pin-description]').clear().type(mapPin.description)
    cy.get('[data-cy="osm-geocoding-input"]').clear().type(mapPin.searchKeyword)
    cy.get('[data-cy="osm-geocoding-results"]')
    cy.wait('@fetchAddress').then(() => {
      cy.get('[data-cy="osm-geocoding-results"]').find('li:eq(0)').click()
    })
  }

  const addContactLink = (link: Omit<ILink, 'key'>) => {
    if (link.index > 0) {
      // click the button to add another set of input fields
      cy.get('[data-cy=add-link]').click()
    }
    // specifies the contact type, such as website or discord
    cy.selectTag(link.label, `[data-cy=select-link-${link.index}]`)
    // input the corresponding value
    cy.get(`[data-cy=input-link-${link.index}]`).clear().type(link.url)
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
          url: `${freshSettings.userName}@test.com`,
        },
        {
          label: 'website',
          url: `http://www.${freshSettings.userName}.com`,
        },
      ],
      location: {
        administrative: 'Central',
        country: 'Singapore',
        countryCode: 'sg',
        latlng: { lng: '103.8194992', lat: '1.357107' },
        name: 'Drongo Trail, Bishan, Singapore, Central, 578774, Singapore',
        postcode: '578774',
        value: 'Singapore',
      },
      mapPinDescription: "Come in & let's make cool stuff out of plastic!",
      profileType: 'workspace',
      userName: 'settings_workplace_new',
      verified: true,
      workspaceType: 'shredder',
    }

    it('[Editing a new Profile]', () => {
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
        label: 'email',
        url: `${freshSettings.userName}@test.com`,
      })
      addContactLink({
        index: 1,
        label: 'website',
        url: `http://www.${freshSettings.userName}.com`,
      })

      cy.interceptAddressFetch(SingaporeStubResponse)
      setWorkspaceMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'Singapo',
        locationName: expected.location.value,
      })

      cy.get('[data-cy=save]').click()
      cy.wait(3000)
      cy.get('[data-cy=save]').should('not.be.disabled')
      cy.step('Verify if all changes were saved correctly')
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })
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
      // note - flag-picker returns country code but displays labels,
      // so tests will only work for countries that code start same as label
      country: 'AU',
      profileType: 'member',
      userName: 'settings_member_new',
      verified: true,
      coverImages: [
        {
          contentType: 'image/jpeg',
          fullPath:
            'uploads/v3_users/settings_member_new/images/profile-cover-1.jpg',
          name: 'profile-cover-1.jpg',
          size: 18987,
          type: 'image/jpeg',
        },
      ],
      links: [
        {
          label: 'email',
          url: `${freshSettings.userName}@test.com`,
        },
      ],
    }
    it('[Cancel edit profile without confirmation dialog]', () => {
      cy.login('settings_member_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      cy.step('Click on How to')
      cy.on('window:confirm', () => {
        throw new Error('Confirm dialog should not be called.')
      })
      cy.get('[data-cy=page-link]').contains('How-to').click()
      cy.step('Confirm log should NOT appear')
    })

    it('[Cancel edit profile and get confirmation]', (done) => {
      cy.login('settings_member_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      cy.get('[data-cy=username').clear().type('Wrong user')
      cy.step('Click on How to')
      cy.get('[data-cy=page-link]').contains('How-to').click()
      cy.step('Confirm log should log')
      cy.on('window:confirm', (text) => {
        expect(text).to.eq(
          'You are leaving this page without saving. Do you want to continue ?',
        )
        done()
      })
    })

    it('[Edit a new profile]', () => {
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
        label: 'email',
        url: `${freshSettings.userName}@test.com`,
      })

      cy.get('[data-cy=save]').click()
      cy.wait(3000)
      cy.get('[data-cy=save]').should('not.be.disabled')
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })
    })

    it('[Add a user pin]', () => {
      const expected = {
        _authID: 'pbx4jStD8sNj4OEZTg4AegLTl6E3',
        _deleted: false,
        _id: 'settings_member_new',
        about: "I'm a very active member",
        // note - flag-picker returns country code but displays labels,
        // so tests will only work for countries that code start same as label
        country: 'AU',
        profileType: 'member',
        userName: 'settings_member_new',
        verified: true,
        coverImages: [
          {
            contentType: 'image/jpeg',
            fullPath:
              'uploads/v3_users/settings_member_new/images/profile-cover-1.jpg',
            name: 'profile-cover-1.jpg',
            size: 18987,
            type: 'image/jpeg',
          },
        ],
        links: [
          {
            label: 'email',
            url: `${freshSettings.userName}@test.com`,
          },
        ],
        mapPinDescription: 'Fun, vibrant and full of amazing people',
        location: {
          administrative: 'Central',
          country: 'Singapore',
          countryCode: 'sg',
          latlng: { lng: '103.8194992', lat: '1.357107' },
          name: 'Drongo Trail, Bishan, Singapore, Central, 578774, Singapore',
          postcode: '578774',
          value: 'Singapore',
        },
      }
      cy.login('settings_member_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus(expected.profileType)

      cy.get('[data-cy=location-dropdown]').should('exist')

      cy.get('[data-cy="add-a-map-pin"]').click()

      setInfo({
        username: expected.userName,
        country: expected.country,
        description: expected.about,
        coverImage: 'images/profile-cover-1.jpg',
      })
      cy.step('Update Contact Links')
      addContactLink({
        index: 0,
        label: 'email',
        url: `${freshSettings.userName}@test.com`,
      })

      cy.interceptAddressFetch(SingaporeStubResponse)
      setMemberMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'Singapo',
        locationName: expected.location.value,
      })
      cy.get('[data-cy=location-dropdown]').should('not.exist')

      cy.step('Remove a user pin')
      cy.get('[data-cy="remove-a-member-map-pin"]').click()
      cy.get('[data-cy=location-dropdown]').should('exist')

      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=save]').should('not.be.disabled')
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })
    })

    it('[Edit Contact and Links]', () => {
      cy.login('settings_member_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)

      addContactLink({
        index: 1,
        label: 'social media',
        url: 'https://social.network',
      })

      // Remove first item
      cy.get('[data-cy="delete-link-0"]').last().trigger('click')

      cy.get('[data-cy="Confirm.modal: Modal"]').should('be.visible')

      cy.get('[data-cy="Confirm.modal: Confirm"]').trigger('click')

      cy.get('[data-cy=save]').click()
      cy.get('[data-cy=save]').should('not.be.disabled')

      // Assert
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', {
            ...expected,
            links: [
              {
                label: 'social media',
                url: 'https://social.network',
              },
            ],
          })
      })
    })
  })

  describe('[Focus Machine Builder]', () => {
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
          contentType: 'image/png',
          fullPath:
            'uploads/v3_users/settings_machine_new/images/profile-cover-2.png',
          name: 'profile-cover-2.png',
          size: 30658,
          type: 'image/png',
        },
      ],
      links: [
        {
          label: 'bazar',
          url: 'http://settings_machine_bazarlink.com',
        },
      ],
      location: {
        administrative: 'Central',
        country: 'Singapore',
        countryCode: 'sg',
        latlng: { lng: '103.8194992', lat: '1.357107' },
        name: 'Drongo Trail, Bishan, Singapore, Central, 578774, Singapore',
        postcode: '578774',
        value: 'Singapore',
      },
      mapPinDescription: 'Informative workshop on machines every week',
      machineBuilderXp: ['electronics', 'welding'],
    }

    it('[Edit a new profile]', () => {
      cy.login('settings_machine_new@test.com', 'test1234')
      cy.step('Go to User Settings')
      cy.clickMenuItem(UserMenuItem.Settings)
      selectFocus(expected.profileType)

      setInfo({
        username: expected.userName,
        description: expected.about,
        coverImage: 'images/profile-cover-2.png',
      })

      cy.step('Choose Expertise')
      cy.get('[data-cy=electronics]').click()
      cy.get('[data-cy=welding]').click()

      cy.step('Update Contact Links')
      addContactLink({
        index: 0,
        label: 'bazar',
        url: `http://settings_machine_bazarlink.com`,
      })

      cy.interceptAddressFetch(SingaporeStubResponse)
      setWorkspaceMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'singapo',
        locationName: expected.location.value,
      })

      cy.get('[data-cy=save]').click()
      cy.wait(3000)
      cy.get('[data-cy=save]').should('not.be.disabled')
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })
    })
  })

  describe('[Focus Community Builder]', () => {
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
        administrative: 'Central',
        country: 'Singapore',
        countryCode: 'sg',
        latlng: { lng: '103.8194992', lat: '1.357107' },
        name: 'Drongo Trail, Bishan, Singapore, Central, 578774, Singapore',
        postcode: '578774',
        value: 'Singapore',
      },
    }

    it('[Edit a new profile]', () => {
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
        addContactLink({ index, label: 'website', url: link.url }),
      )

      cy.interceptAddressFetch(SingaporeStubResponse)
      setWorkspaceMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'Singa',
        locationName: expected.location.value,
      })

      cy.get('[data-cy=save]').click()
      cy.wait(3000)
      cy.get('[data-cy=save]').should('not.be.disabled')
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })
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
          label: 'social media',
          url: 'http://www.facebook.com/settings_plastic_new',
        },
        {
          label: 'social media',
          url: 'http://www.twitter.com/settings_plastic_new',
        },
      ],
      location: {
        administrative: 'Central',
        country: 'Singapore',
        countryCode: 'sg',
        latlng: { lng: '103.8194992', lat: '1.357107' },
        name: 'Drongo Trail, Bishan, Singapore, Central, 578774, Singapore',
        postcode: '578774',
        value: 'Singapore',
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
      cy.selectTag(selectedValue, selector)
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
        label: 'social media',
        url: `http://www.facebook.com/${freshSettings.userName}`,
      })
      addContactLink({
        index: 1,
        label: 'social media',
        url: `http://www.twitter.com/${freshSettings.userName}`,
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

      cy.interceptAddressFetch(SingaporeStubResponse)
      setWorkspaceMapPin({
        description: expected.mapPinDescription,
        searchKeyword: 'Singapo',
        locationName: expected.location.value,
      })
      cy.get('[data-cy=save]').click()
      cy.wait(3000)
      cy.get('[data-cy=save]').should('not.be.disabled')
      cy.queryDocuments(
        DbCollectionName.users,
        'userName',
        '==',
        expected.userName,
      ).then((docs) => {
        cy.log('queryDocs', docs)
        expect(docs.length).to.equal(1)
        cy.wrap(null)
          .then(() => docs[0])
          .should('eqSettings', expected)
      })
    })
  })
})
