import * as React from 'react'

import subDays from 'date-fns/sub_days'
import ListRow from '.'
import { PostDate } from './elements'
import { shallow } from 'enzyme'

describe('ListRow', () => {
  it('Should calculate duration since posted', () => {
    const sutPost = {
      _id: 'test id',
      index: 0,
      avatar: 'test avatar',
      tags: [],
      date: subDays(new Date(), 3).toString(),
      postTitle: 'test title',
      commentCount: 0,
      viewCount: 0,
      usefullCount: 0,
      postType: 'article',
    }
    const wrapper = shallow(<ListRow post={sutPost} />)

    const daysSince = wrapper.find(PostDate).text()

    expect(daysSince).toEqual('3 days')
  })
})
