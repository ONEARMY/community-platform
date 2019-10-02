import {
  IUserPP,
  IProfileType,
  IWorkspaceType,
} from 'src/models/user_pp.models'
import { MOCK_DB_META } from './db.mock'
import { IPlasticType, IMAchineBuilderXp } from 'src/models/user_pp.models'

// assets plasticType
import Pet from 'src/assets/images/plastic-types/pet.jpg'
import PP from 'src/assets/images/plastic-types/pp.jpg'
import PS from 'src/assets/images/plastic-types/ps.jpg'
import Hdpe from 'src/assets/images/plastic-types/hdpe.jpg'
import Ldpe from 'src/assets/images/plastic-types/ldpe.jpg'
import Other from 'src/assets/images/plastic-types/other.jpg'
import Pvc from 'src/assets/images/plastic-types/pvc.jpg'

// assets profileType
import CollectionBadge from 'src/assets/images/badges/pt-collection-point.jpg'
import MemberBadge from 'src/assets/images/badges/pt-member.jpg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.jpg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.jpg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.jpg'

// assets workspaceType
import Extrusion from 'src/assets/images/workspace-focus/extrusion.jpg'
import Injection from 'src/assets/images/workspace-focus/injection.jpg'
import Mix from 'src/assets/images/workspace-focus/mix.jpg'
import Sheetpress from 'src/assets/images/workspace-focus/sheetpress.jpg'
import Shredder from 'src/assets/images/workspace-focus/shredder.jpg'

export const MOCK_USER_WORKSPACE: IUserPP = {
  verified: true,
  userName: 'chris-m-clarke',
  about:
    "Description of user profile, it's a nice workspace where we build products out of recycled plastic",
  ...MOCK_DB_META(),
  _authID: '123',
  DHSite_id: 70134,
  DHSite_mention_name: 'chris-m-clarke',
  country: '',
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
}
export const MOCK_USER_COLLECTION: IUserPP = {
  verified: true,
  userName: 'collection-username',
  about: 'We are collecting plastic in city center',
  ...MOCK_DB_META(),
  _authID: '123',
  country: 'Netherlands',
  profileType: 'collection-point',
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
}
export const MOCK_USER_MEMBER: IUserPP = {
  verified: true,
  userName: 'member-username',
  about: "I'm just a member of this community that share knowledge",
  ...MOCK_DB_META(),
  _authID: '123',
  country: 'Netherlands',
  profileType: 'member',
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
}
export const MOCK_USER_COMMUNITY: IUserPP = {
  verified: true,
  userName: 'community-username',
  about: 'We are building a local community to fight plastic waste',
  ...MOCK_DB_META(),
  _authID: '123',
  country: 'Kenya',
  profileType: 'community-builder',
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
  isV4Member: true,
  // location: {
  //   address: 'Eindhoven, Noord-Brabant, The Netherlands',
  //   lat: 51.4393,
  //   lng: 5.47863,
  // },
}
export const MOCK_USER_MACHINE: IUserPP = {
  verified: true,
  userName: 'community-username',
  about: 'We are building machine to recycle plastic',
  ...MOCK_DB_META(),
  _authID: '123',
  country: 'USA',
  profileType: 'machine-builder',
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
  isExpert: true,
  isV4Member: false,
  // location: {
  //   address: 'Dallas, Texas, USA',
  //   lat: 51.4393,
  //   lng: 5.47863,
  // },
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
    label: 'workspace',
    textLabel: 'I run a workspace',
    imageSrc: WorkspaceBadge,
  },
  {
    label: 'member',
    textLabel: 'I am a member',
    imageSrc: MemberBadge,
  },
  {
    label: 'machine-builder',
    textLabel: 'I build machines',
    imageSrc: MachineBadge,
  },
  {
    label: 'community-builder',
    textLabel: 'I run a local community',
    imageSrc: LocalComBadge,
  },
  {
    label: 'collection-point',
    textLabel: 'I collect & sort plastic',
    imageSrc: CollectionBadge,
  },
]

export const WORKSPACE_TYPES: IWorkspaceType[] = [
  {
    label: 'shredder',
    textLabel: 'shredder',
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
