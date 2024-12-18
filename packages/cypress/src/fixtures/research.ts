import dateformat from 'dateformat'
import { IModerationStatus } from 'oa-shared'

import { generateAlphaNumeric } from '../utils/TestUtils'

import type { IResearchDB } from 'oa-shared'

const research_id = generateAlphaNumeric(20)
const update_id = generateAlphaNumeric(20)
const _created = dateformat(Date.now(), 'yyyy-mm-dd')
const _createdBy = 'best-researcher'

export const research: IResearchDB = {
  _created,
  _createdBy,
  _deleted: false,
  _id: research_id,
  creatorCountry: 'ge',
  collaborators: [],
  description: 'All of this for the discussion tests.',
  moderation: IModerationStatus.ACCEPTED,
  title: 'Discussion research',
  slug: 'discussion-research',
  previousSlugs: ['discussion-research'],
  tags: {
    h1wCs0o9j60lkw3AYPB1: true,
  },
  totalCommentCount: 0,
  researchCategory: {
    _modified: '2012-10-27T01:47:57.948Z',
    _created: '2012-08-02T07:27:04.609Z',
    _id: 'ehdI345E36hWyk3Ockr',
    label: 'Landscaping',
    _deleted: false,
  },
  updates: [
    {
      _created,
      _deleted: false,
      _id: update_id,
      description: 'qwerty',
      collaborators: [_createdBy],
      commentCount: 0,
      images: [],
      title: 'Dis update!',
      files: [],
      downloadCount: 0,
      fileLink: '',
    },
  ],
}
