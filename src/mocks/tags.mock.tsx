import { ITag } from 'src/models/tags.model'
import { MOCK_DB_META } from './db.mock'

export const TAGS_MOCK: ITag[] = [
  // how-to
  {
    ...MOCK_DB_META('DJN99ErXz8FHy035YdMO'),
    image: '',
    label: 'extrusion',
    categories: ['how-to'],
  },
  {
    ...MOCK_DB_META('fLUiS1PS9WEKSRlTe8Cs'),
    image: '',
    label: 'shredder',
    categories: ['how-to'],
  },
  {
    ...MOCK_DB_META('JVpo3tdEqbk8G787hAZH'),
    image: '',
    label: 'injection',
    categories: ['how-to'],
  },
  {
    ...MOCK_DB_META('kuJqlMsnpfr5VR4BZ1ML'),
    image: '',
    label: 'compression',
    categories: ['how-to'],
  },
  {
    ...MOCK_DB_META('jUtS7pVbv7DXoQyV13RR'),
    image: '',
    label: 'sorting',
    categories: ['how-to'],
  },
  {
    ...MOCK_DB_META('gsGdG7sE88cgzZxlvfVs'),
    image: '',
    label: 'melting',
    categories: ['how-to'],
  },
  // events
  {
    ...MOCK_DB_META('1zfteiFXNDbDnlE3Incg'),
    image: '',
    label: 'cleanup',
    categories: ['event'],
  },
  {
    ...MOCK_DB_META('9RlNW5tLD3BxMhL7keFN'),
    image: '',
    label: 'workshop',
    categories: ['event'],
  },
  {
    ...MOCK_DB_META('T7bZy8OhN7K4OWJ09wSX'),
    image: '',
    label: 'exhibition',
    categories: ['event'],
  },
  {
    ...MOCK_DB_META('cd41vHdBh1M2YtPlYcYR'),
    image: '',
    label: 'presentation',
    categories: ['event'],
  },
  {
    ...MOCK_DB_META('IM8aJW5LrQDK2Mby8rYJ'),
    image: '',
    label: 'screening',
    categories: ['event'],
  },
  {
    ...MOCK_DB_META('kVSRJqFt52hi8RHW5wjb'),
    image: '',
    label: 'meet & greet',
    categories: ['event'],
  },
  {
    ...MOCK_DB_META('7yhssOmZqiihTBXK2cxU'),
    image: '',
    label: 'brainstorm session',
    categories: ['event'],
  },
  {
    ...MOCK_DB_META('5nXtB6mHdffDurEDLt6Q'),
    image: '',
    label: 'open day',
    categories: ['event'],
  },
  {
    ...MOCK_DB_META('Qr2sOd3aM4CvZsSfFkPn'),
    image: '',
    label: 'protest',
    categories: ['event'],
  },
]
