import '@testing-library/jest-dom/vitest'

import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HideDiscussionContainer } from './HideDiscussionContainer'

describe('HideDiscussionContainer', () => {
  it('can be opened/closed', async () => {
    const { getByText } = render(
      <HideDiscussionContainer commentCount={0}>
        <>Hidden</>
      </HideDiscussionContainer>,
    )
    const button = getByText('Start a discussion')
    expect(() => getByText('Hidden')).toThrow()

    fireEvent.click(button)
    getByText('Collapse Comments')
    expect(getByText('Hidden')).toBeInTheDocument()
  })

  it('renders right text for 1 comment', () => {
    const { getByText } = render(
      <HideDiscussionContainer commentCount={1}>
        <></>
      </HideDiscussionContainer>,
    )
    expect(getByText('View 1 comment')).toBeInTheDocument()
  })

  it('renders right text for 567 comments', () => {
    const { getByText } = render(
      <HideDiscussionContainer commentCount={567}>
        <></>
      </HideDiscussionContainer>,
    )
    expect(getByText('View 567 comments')).toBeInTheDocument()
  })
})
