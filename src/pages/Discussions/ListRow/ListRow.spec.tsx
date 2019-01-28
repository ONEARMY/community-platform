import * as React from 'react'

import subDays from 'date-fns/sub_days'
import ListRow from './ListRow'
import { PostDate } from './elements'
import { shallow } from 'enzyme'

describe('ListRow', () => {
  it('Should calculate duration since posted', () => {
    const sutPost = {
      date: subDays(new Date(), 3),
    }
    const wrapper = shallow(<ListRow post={sutPost} />)

    const daysSince = wrapper.find(PostDate).text()

    expect(daysSince).toEqual('3 days')
  })
})
