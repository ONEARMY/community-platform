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
    const { getByAltText, getByText } = render(
      <Default {...(Default.args as Props)} />,
    )
    const icon = getByAltText('icon')

    expect(getByText('7 replies to Jeff')).toBeInTheDocument()
    expect(icon.getAttribute('src')).toContain('arrow-down')
  })

  it('renders the button text', () => {
    const { getByAltText } = render(
      <RepliesShowing {...(RepliesShowing.args as Props)} />,
    )
    const icon = getByAltText('icon')

    expect(icon.getAttribute('src')).toContain('arrow-up')
  })

  it('renders the word reply when expected', () => {
    const { getByText } = render(<OneReply {...(OneReply.args as Props)} />)

    expect(getByText('1 reply to Zelda')).toBeInTheDocument()
  })

  it('renders the number zero when expected', () => {
    const { getByText } = render(<NoReplies {...(NoReplies.args as Props)} />)

    expect(getByText('Reply to Link')).toBeInTheDocument()
  })
})
