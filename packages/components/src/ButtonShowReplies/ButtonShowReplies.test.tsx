import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
import {
  Default,
  NoReplies,
  OneReply,
  RepliesShowing,
} from './ButtonShowReplies.stories'

import type { Props } from './ButtonShowReplies'

describe('ButtonShowReplies', () => {
  it('renders the button text', () => {
    const { getByTestId, getByText } = render(
      <Default {...(Default.args as Props)} />,
    )
    const icon = getByTestId('show-replies')

    expect(getByText('Show 7 replies')).toBeInTheDocument()
    expect(icon.getAttribute('icon')).toContain('chevron-down')
  })

  it('renders the button text', () => {
    const { getByTestId } = render(
      <RepliesShowing {...(RepliesShowing.args as Props)} />,
    )
    const icon = getByTestId('show-replies')

    expect(icon.getAttribute('icon')).toContain('chevron-up')
  })

  it('renders the word reply when expected', () => {
    const { getByText } = render(<OneReply {...(OneReply.args as Props)} />)

    expect(getByText('Show 1 reply')).toBeInTheDocument()
  })

  it('renders the number zero when expected', () => {
    const { getByText } = render(<NoReplies {...(NoReplies.args as Props)} />)

    expect(getByText('Reply')).toBeInTheDocument()
  })
})
