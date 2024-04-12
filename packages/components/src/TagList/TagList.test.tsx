import { render } from '../tests/utils'
import { TagList } from './TagList'

describe('TagList', () => {
  it('renders multiple tags', () => {
    const tagList = [
      { label: 'The best tag' },
      { label: 'The second best tag' },
    ]

    const { getByText } = render(<TagList tags={tagList} />)

    expect(getByText(tagList[0].label)).toBeInTheDocument()
    expect(getByText(tagList[1].label)).toBeInTheDocument()
  })
})
