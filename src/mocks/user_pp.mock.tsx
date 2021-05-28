import {
  IUserPP,
  IProfileType,
  IWorkspaceType,
} from 'src/models/user_pp.models'
import { MOCK_DB_META } from './db.mock'
import { MOCK_USER } from './user.mock'
import { IPlasticType, IMAchineBuilderXp } from 'src/models/user_pp.models'

// assets plasticType
import Pet from 'src/assets/images/plastic-types/pet.svg'
import PP from 'src/assets/images/plastic-types/pp.svg'
import PS from 'src/assets/images/plastic-types/ps.svg'
import Hdpe from 'src/assets/images/plastic-types/hdpe.svg'
import Ldpe from 'src/assets/images/plastic-types/ldpe.svg'
import Other from 'src/assets/images/plastic-types/other.svg'
import Pvc from 'src/assets/images/plastic-types/pvc.svg'

// assets profileType
import CollectionBadge from 'src/assets/images/badges/pt-collection-point.svg'
import MemberBadge from 'src/assets/images/badges/pt-member.svg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.svg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.svg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.svg'
import LogoWorkspace from 'src/assets/icons/map-workspace.svg'
import LogoCollection from 'src/assets/icons/map-collection.svg'
import LogoMember from 'src/assets/icons/map-member.svg'
import LogoMachine from 'src/assets/icons/map-machine.svg'
import LogoCommunity from 'src/assets/icons/map-community.svg'

// assets workspaceType
import Extrusion from 'src/assets/images/workspace-focus/extrusion.png'
import Injection from 'src/assets/images/workspace-focus/injection.png'
import Mix from 'src/assets/images/workspace-focus/mix.png'
import Sheetpress from 'src/assets/images/workspace-focus/sheetpress.png'
import Shredder from 'src/assets/images/workspace-focus/shredder.png'

export const MOCK_USER_WORKSPACE: IUserPP = {
  ...MOCK_USER,
  userName: 'workspace-username',
  about:
    "Description of user profile, it's a nice workspace where we build products out of recycled plastic",
  profileType: 'workspace',
  workspaceType: 'extrusion',
  coverImages: [
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
  ],
  links: [
    {
      label: 'instagram',
      url: 'https://www.instagram.com/realpreciousplastic/',
    },
    {
      label: 'facebook',
      url: 'https://www.facebook.com/preciousplastic/',
    },
  ],
  mapPinDescription: 'This is a description to display on the map user card',
  isExpert: true,
  isV4Member: false,
  openingHours: [],
  collectedPlasticTypes: [],
  machineBuilderXp: [],
}
export const MOCK_USER_COLLECTION: IUserPP = {
  verified: true,
  badges: { verified: true },
  userName: 'collection-username',
  about: 'We are collecting plastic in city center',
  ...MOCK_DB_META(),
  _authID: '123',
  country: 'Netherlands',
  profileType: 'collection-point',
  moderation: 'accepted',
  displayName: 'collection-username',
  coverImages: [
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
  ],
  links: [
    {
      label: 'instagram',
      url: 'https://www.instagram.com/realpreciousplastic/',
    },
    {
      label: 'facebook',
      url: 'https://www.facebook.com/preciousplastic/',
    },
  ],
  mapPinDescription: 'Collecting plastic',
  isExpert: false,
  isV4Member: true,
  openingHours: [],
  collectedPlasticTypes: [],
  machineBuilderXp: [],
  votedUsefulHowtos: {},
}
export const MOCK_USER_MEMBER: IUserPP = {
  verified: true,
  badges: { verified: false },
  userName: 'member-username',
  about: "I'm just a member of this community that share knowledge",
  ...MOCK_DB_META(),
  _authID: '123',
  country: 'Netherlands',
  profileType: 'member',
  moderation: 'accepted',
  displayName: 'member-username',
  coverImages: [
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
  ],
  links: [
    {
      label: 'instagram',
      url: 'https://www.instagram.com/realpreciousplastic/',
    },
    {
      label: 'facebook',
      url: 'https://www.facebook.com/preciousplastic/',
    },
  ],
  isExpert: false,
  isV4Member: false,
  openingHours: [],
  collectedPlasticTypes: [],
  machineBuilderXp: [],
  votedUsefulHowtos: {},
}
export const MOCK_USER_COMMUNITY: IUserPP = {
  verified: true,
  badges: { verified: true },
  userName: 'community-username',
  about: 'We are building a local community to fight plastic waste',
  ...MOCK_DB_META(),
  _authID: '123',
  country: 'Kenya',
  profileType: 'community-builder',
  moderation: 'accepted',
  displayName: 'community-username',
  coverImages: [
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
  ],
  links: [
    {
      label: 'instagram',
      url: 'https://www.instagram.com/realpreciousplastic/',
    },
    {
      label: 'facebook',
      url: 'https://www.facebook.com/preciousplastic/',
    },
  ],
  workspaceType: 'mix',
  mapPinDescription: null,
  isExpert: false,
  isV4Member: true,
  openingHours: [],
  collectedPlasticTypes: [],
  machineBuilderXp: [],
  votedUsefulHowtos: {},
}
export const MOCK_USER_MACHINE: IUserPP = {
  verified: true,
  badges: { verified: true },
  userName: 'community-username',
  about: 'We are building machine to recycle plastic',
  ...MOCK_DB_META(),
  _authID: '123',
  country: 'USA',
  profileType: 'machine-builder',
  moderation: 'accepted',
  displayName: 'collection-username',
  coverImages: [
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
  ],
  links: [
    {
      label: 'instagram',
      url: 'https://www.instagram.com/realpreciousplastic/',
    },
    {
      label: 'facebook',
      url: 'https://www.facebook.com/preciousplastic/',
    },
  ],
  workspaceType: 'mix',
  mapPinDescription: null,
  isExpert: true,
  isV4Member: false,
  openingHours: [],
  collectedPlasticTypes: [],
  machineBuilderXp: [],
  votedUsefulHowtos: {},
}

export const PLASTIC_TYPES: IPlasticType[] = [
  {
    label: 'pet',
    number: '1',
    imageSrc: Pet,
  },
  {
    label: 'hdpe',
    number: '2',
    imageSrc: Hdpe,
  },
  {
    label: 'pvc',
    number: '3',
    imageSrc: Pvc,
  },
  {
    label: 'ldpe',
    number: '4',
    imageSrc: Ldpe,
  },
  {
    label: 'pp',
    number: '5',
    imageSrc: PP,
  },
  {
    label: 'ps',
    number: '6',
    imageSrc: PS,
  },
  {
    label: 'other',
    number: '7',
    imageSrc: Other,
  },
]

export const MACHINE_BUILDER_XP: IMAchineBuilderXp[] = [
  {
    label: 'electronics',
  },
  {
    label: 'machining',
  },
  {
    label: 'welding',
  },
  {
    label: 'assembling',
  },
  {
    label: 'mould-making',
  },
]

export const PROFILE_TYPES: IProfileType[] = [
  {
    label: 'member',
    textLabel: 'I am a member',
    imageSrc: MemberBadge,
    cleanImageSrc: LogoMember,
  },
  {
    label: 'workspace',
    textLabel: 'I run a workspace',
    imageSrc: WorkspaceBadge,
    cleanImageSrc: LogoWorkspace,
  },
  {
    label: 'machine-builder',
    textLabel: 'I build machines',
    imageSrc: MachineBadge,
    cleanImageSrc: LogoMachine,
  },
  {
    label: 'community-builder',
    textLabel: 'I run a local community',
    imageSrc: LocalComBadge,
    cleanImageSrc: LogoCommunity,
  },
  {
    label: 'collection-point',
    textLabel: 'I collect & sort plastic',
    imageSrc: CollectionBadge,
    cleanImageSrc: LogoCollection,
  },
]

export const WORKSPACE_TYPES: IWorkspaceType[] = [
  {
    label: 'shredder',
    textLabel: 'Shredder',
    subText: 'Shredding plastic waste into flakes',
    imageSrc: Shredder,
  },
  {
    label: 'sheetpress',
    textLabel: 'Sheetpress',
    subText: 'Making recycled plastic sheets',
    imageSrc: Sheetpress,
  },
  {
    label: 'extrusion',
    textLabel: 'Extrusion',
    subText: 'Extruding plastic into beams or products',
    imageSrc: Extrusion,
  },
  {
    label: 'injection',
    textLabel: 'Injection',
    subText: 'Making small productions of goods',
    imageSrc: Injection,
  },
  {
    label: 'mix',
    textLabel: 'Mix',
    subText: 'Running a workspace with multiple machines and goals',
    imageSrc: Mix,
  },
]
