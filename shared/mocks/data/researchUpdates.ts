import type { DBResearchUpdate } from '../../models'

export const researchUpdates: Partial<DBResearchUpdate>[] = [
  {
    created_at: new Date('2022-03-27T22:10:11.271Z'),
    deleted: false,
    modified_at: new Date('2022-03-27T22:10:11.271Z'),
    description: 'qwerty',
    comment_count: 1,
    title: 'qwerty 1',
    files: [
      {
        name: 'art final 2.skp',
        id: '647225',
        size: 647225,
      },
    ],
    file_download_count: 2555,
  },
  {
    created_at: new Date('2022-04-27T22:10:11.271Z'),
    deleted: false,
    modified_at: new Date('2022-04-27T22:10:11.271Z'),
    description: 'qwerty',
    comment_count: 0,
    title: 'qwerty 2',
  },
  {
    created_at: new Date('2022-05-27T22:10:11.271Z'),
    deleted: false,
    modified_at: new Date('2022-05-27T22:10:11.271Z'),
    description: 'qwerty',
    comment_count: 0,
    title: 'qwerty 3',
  },
  {
    created_at: new Date('2022-06-27T22:10:11.271Z'),
    deleted: false,
    modified_at: new Date('2022-06-27T22:10:11.271Z'),
    description: 'qwerty',
    comment_count: 0,
    title: 'qwerty 4',
  },
]
