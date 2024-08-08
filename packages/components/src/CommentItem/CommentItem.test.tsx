import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default } from './CommentItem.stories'

import type { IProps } from './CommentItem'

describe('CommentItem', () => {
  it('shows the avatar', () => {
    const { getByTestId } = render(<Default {...(Default.args as IProps)} />)

    expect(getByTestId('commentAvatar')).toBeInTheDocument()
    expect((getByTestId('commentAvatar').firstChild as HTMLImageElement).getAttribute("alt")).not.empty
  })
  it('shows the comment text', () => {
    const { getByTestId } = render(<Default {...(Default.args as IProps)} />)

    expect(getByTestId('commentText')).toBeInTheDocument()
  })
})
