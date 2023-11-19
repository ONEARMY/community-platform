import { render } from '../tests/utils'
import { Default } from './CommentList.stories'
import { CommentList } from './CommentList'

describe('CommentList', () => {
  it('renders a list of items', () => {
    const { getByText } = render(<CommentList {...Default.args} />)

    expect(getByText(Default.args.comments[0].text)).toBeInTheDocument()
  })
})
