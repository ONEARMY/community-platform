import { ResearchStatus, ResearchUpdateStatus } from 'oa-shared'

import type { ResearchItem } from 'oa-shared'

const _createdBy = 'best-researcher'

export const research: ResearchItem = {
  createdAt: new Date(),
  modifiedAt: new Date(),
  collaboratorsUsernames: ['best-researcher'],
  image: null,
  status: ResearchStatus.IN_PROGRESS,
  subscriberCount: 0,
  totalViews: 0,
  updateCount: 1,
  usefulCount: 0,
  author: {
    id: 1,
    isSupporter: true,
    isVerified: true,
    name: _createdBy,
    username: _createdBy,
  },
  deleted: false,
  id: 1,
  collaborators: [],
  description: 'All of this for the discussion tests.',
  title: 'Discussion research',
  slug: 'discussion-research',
  previousSlugs: ['discussion-research'],
  tags: [
    {
      id: 123,
      name: 'hi',
    },
  ],
  commentCount: 0,
  category: {
    createdAt: new Date(),
    id: 1,
    name: 'Landscape',
    type: 'research',
  },
  updates: [
    {
      createdAt: new Date(),
      deleted: false,
      id: 1,
      description: 'qwerty',
      author: {
        id: 1,
        isSupporter: true,
        isVerified: true,
        name: _createdBy,
        username: _createdBy,
      },
      commentCount: 0,
      images: [],
      title: 'Dis update!',
      modifiedAt: new Date(),
      status: ResearchUpdateStatus.PUBLISHED,
      videoUrl: '',
      fileDownloadCount: 0,
      fileIds: [],
    },
  ],
}
