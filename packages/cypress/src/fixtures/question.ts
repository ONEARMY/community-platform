import dateformat from 'dateformat'
import { IModerationStatus } from 'oa-shared'

import { generateAlphaNumeric } from '../utils/TestUtils'

import type { IQuestionDB } from 'oa-shared'

const _id = generateAlphaNumeric(20)
const _created = dateformat(Date.now(), 'yyyy-mm-dd')

export const question: IQuestionDB = {
  _id,
  _created,
  _deleted: false,
  description: 'Quick question for discussion testing.',
  title: 'Quick question',
  slug: 'quick-question',
  previousSlugs: [],
  tags: {
    dibcwRYbQVzfQfmSkg5x: true,
  },
  moderation: IModerationStatus.ACCEPTED,
  _createdBy: 'super-question-creator',
  creatorCountry: 'fr',
  keywords: [],
  questionCategory: {
    _created: '2017-11-20T05:58:20.458Z',
    _deleted: false,
    _id: 'categoryLmj5B5UJh0M8BxSTP3uI',
    _modified: '2018-07-29T04:34:49.982Z',
    label: 'exhibition',
  },
}
