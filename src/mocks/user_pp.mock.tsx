import { IUser } from 'src/models/user.models'
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

// export const MOCK_USER_PP: IUser = {
//   verified: true,
//   userName: 'chris-m-clarke',
//   ...MOCK_DB_META(),
//   _authID: '123',
//   DHSite_id: 70134,
//   DHSite_mention_name: 'chris-m-clarke',
//   country: '',
// }

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
