import { ExternalLinkLabel } from 'oa-shared'

export const freshSettingsWorkplace = {
  _authID: 'l9N5HFHzSjQvtP9g9MyFnPpkFmM2',
  _id: 'settings_workplace_new',
  userName: 'settings_workplace_new',
  _deleted: false,
  verified: true,
}

export const expectedWorkplace = {
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
  impact: {
    2022: [
      {
        id: 'plastic',
        value: 43000,
        isVisible: true,
      },
      {
        id: 'revenue',
        value: 100000,
        isVisible: false,
      },
      {
        id: 'employees',
        value: 3,
        isVisible: true,
      },
      {
        id: 'volunteers',
        value: 45,
        isVisible: false,
      },
    ],
  },
  isContactableByPublic: true,
  links: [
    {
      label: ExternalLinkLabel.EMAIL,
      url: `${freshSettingsWorkplace.userName}@test.com`,
    },
    {
      label: ExternalLinkLabel.WEBSITE,
      url: `http://www.${freshSettingsWorkplace.userName}.com`,
    },
  ],
  location: {
    administrative: '',
    country: 'Singapore',
    countryCode: 'sg',
    latlng: { lng: '103.8194992', lat: '1.357107' },
    name: 'Drongo Trail, Bishan, Central, Singapore, 578774, Singapore',
    postcode: '578774',
    value: 'Singapore',
  },
  mapPinDescription: "Come in & let's make cool stuff out of plastic!",
  profileType: 'workspace',
  userName: 'settings_workplace_new',
  verified: true,
  workspaceType: 'shredder',
}

export const freshSettingsMember = {
  _authID: 'pbx4jStD8sNj4OEZTg4AegLTl6E3',
  _id: 'settings_member_new',
  userName: 'settings_member_new',
  _deleted: false,
  verified: true,
}

export const expectedMember = {
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
      label: ExternalLinkLabel.EMAIL,
      url: `${freshSettingsMember.userName}@test.com`,
    },
  ],
  mapPinDescription: 'Fun, vibrant and full of amazing people',
  location: {
    administrative: '',
    country: 'Singapore',
    countryCode: 'sg',
    latlng: { lng: '103.8194992', lat: '1.357107' },
    name: 'Drongo Trail, Bishan, Central, Singapore, 578774, Singapore',
    postcode: '578774',
    value: 'Singapore',
  },
}

export const expectedMachineBuilder = {
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
      label: ExternalLinkLabel.BAZAR,
      url: 'http://settings_machine_bazarlink.com',
    },
  ],
  location: {
    administrative: '',
    country: 'Singapore',
    countryCode: 'sg',
    latlng: { lng: '103.8194992', lat: '1.357107' },
    name: 'Drongo Trail, Bishan, Central, Singapore, 578774, Singapore',
    postcode: '578774',
    value: 'Singapore',
  },
  mapPinDescription: 'Informative workshop on machines every week',
  machineBuilderXp: ['electronics', 'welding'],
  isContableByPublic: false,
}

export const expectedCommunityBuilder = {
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
    administrative: '',
    country: 'Singapore',
    countryCode: 'sg',
    latlng: { lng: '103.8194992', lat: '1.357107' },
    name: 'Drongo Trail, Bishan, Central, Singapore, 578774, Singapore',
    postcode: '578774',
    value: 'Singapore',
  },
}

export const freshSettingsPlastic = {
  _authID: 'uxupeYR7glagQyhBy8q0blr0chd2',
  _id: 'settings_plastic_new',
  userName: 'settings_plastic_new',
  _deleted: false,
  verified: true,
}

export const expectedPlastic = {
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
    administrative: '',
    country: 'Singapore',
    countryCode: 'sg',
    latlng: { lng: '103.8194992', lat: '1.357107' },
    name: 'Drongo Trail, Bishan, Central, Singapore, 578774, Singapore',
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
