import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import { Default, WithoutAvatar } from './CommentItem.stories'

import type { IProps } from './CommentItem'

describe('CommentList', () => {
  it('shows the avatar when set', () => {
    const { getByTestId } = render(<Default {...(Default.args as IProps)} />)

    expect(getByTestId('commentAvatar')).toBeInTheDocument()
  })

  it('hides the avatar when set', () => {
    const { getByTestId } = render(
      <WithoutAvatar {...(WithoutAvatar.args as IProps)} />,
    )

    expect(() => getByTestId('commentAvatar')).toThrow()
  })
})
