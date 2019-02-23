import * as React from 'react'

import subDays from 'date-fns/sub_days'
import ListRow from '.'
import { PostDate } from './elements'
import { shallow } from 'enzyme'
import { DISCUSSION_QUESTION_MOCKS } from 'src/mocks/discussions.mock'

describe('ListRow', () => {
  it('Should calculate duration since posted', () => {
    const sutPost = DISCUSSION_QUESTION_MOCKS[0]
    const wrapper = shallow(<ListRow post={sutPost} />)

    const daysSince = wrapper.find(PostDate).text()

    expect(daysSince).toEqual('3 days')
  })
})
