import { IUserPP } from 'src/models/user_pp.models'
import { MOCK_DB_META } from './db.mock'
import { IPlasticType, IMAchineBuilderXp } from 'src/models/user_pp.models'

// assets
import Pet from 'src/assets/images/plastic-types/pet.jpg'
import PP from 'src/assets/images/plastic-types/pp.jpg'
import PS from 'src/assets/images/plastic-types/ps.jpg'
import Hdpe from 'src/assets/images/plastic-types/hdpe.jpg'
import Ldpe from 'src/assets/images/plastic-types/ldpe.jpg'
import Other from 'src/assets/images/plastic-types/other.jpg'
import Pvc from 'src/assets/images/plastic-types/pvc.jpg'

export const MOCK_USER_PP: IUserPP = {
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
