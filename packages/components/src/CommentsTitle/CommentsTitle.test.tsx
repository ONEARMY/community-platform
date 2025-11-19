import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import {
  COMMENTS,
  CommentsTitle,
  NO_COMMENTS,
  ONE_COMMENT,
} from './CommentsTitle'

import type { Comment } from 'oa-shared'

describe('CommentsTitle', () => {
  it('renders correctly when there are zero comments', () => {
    const { getByText } = render(<CommentsTitle comments={[]} />)

    expect(getByText(NO_COMMENTS)).toBeInTheDocument()
  })

  it('renders correctly when there is one comment', () => {
    const comment = {} as Comment
    const { getByText } = render(<CommentsTitle comments={[comment]} />)

    expect(getByText(ONE_COMMENT)).toBeInTheDocument()
  })

  it('renders correctly when there are multiple comments', () => {
    const comment = {} as Comment
    const { getByText } = render(
      <CommentsTitle comments={[comment, comment, comment]} />,
    )

    expect(getByText(`3 ${COMMENTS}`)).toBeInTheDocument()
  })
})
