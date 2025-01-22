import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { COMMENTS, NO_COMMENTS, ONE_COMMENT } from './CommentsTitle'
import {
  MultipleComments,
  NoComments,
  OneComment,
} from './CommentsTitle.stories'

import type { IProps } from './CommentsTitle'

describe('CommentsTitle', () => {
  it('renders correctly when there are zero comments', () => {
    const { getByText } = render(
      <NoComments {...(NoComments.args as IProps)} />,
    )

    expect(getByText(NO_COMMENTS)).toBeInTheDocument()
  })

  it('renders correctly when there is one comment', () => {
    const { getByText } = render(
      <OneComment {...(OneComment.args as IProps)} />,
    )

    expect(getByText(ONE_COMMENT)).toBeInTheDocument()
  })

  it('renders correctly when there are multiple comments', () => {
    const { getByText } = render(
      <MultipleComments {...(MultipleComments.args as IProps)} />,
    )

    expect(getByText(`3 ${COMMENTS}`)).toBeInTheDocument()
  })
})
