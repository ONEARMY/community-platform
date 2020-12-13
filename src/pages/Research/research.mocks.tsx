import { IResearch } from './research.models'
import { MOCK_DB_META } from 'src/mocks/db.mock'

export const MOCK_RESEARCH_ITEMS: IResearch.ItemDB[] = [
  {
    ...MOCK_DB_META(),
    title: 'Make a big 244 x 122 sheetpress',
    description: 'We want to see whether we can make a big sheetpress',
    slug: 'make-a-big-244-x-122-sheetpress',
    tags: { 'Plastic Hero': true, 'Another tag': true },
    updates: [
      {
        ...MOCK_DB_META(),
        title: 'Research Online',
        description: 'We looked into some online reach that you can find',
        files: [],
      },
    ],
  },
]
