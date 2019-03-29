import * as React from 'react'

import ListRow from '.'
import { PostDate } from './elements'
import { shallow } from 'enzyme'
import { DISCUSSION_QUESTION_MOCKS } from 'src/mocks/discussions.mock'
import differenceInDays from 'date-fns/difference_in_days'


describe('ListRow', () => {
  it('Should calculate duration since posted', () => {
    // arrange
    const sutPost = DISCUSSION_QUESTION_MOCKS[0]
    const wrapper = shallow(<ListRow post={sutPost} />)
    const expected = `${differenceInDays(new Date(), sutPost._created.toDate())} days`;
    // act
    const result = wrapper.find(PostDate).text()
    // assert
    expect(result).toEqual(expected)
  })
})
