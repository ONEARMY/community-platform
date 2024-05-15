import { render } from '@testing-library/react'

import { drafts } from '../labels'
import DraftButton from './DraftButton'

describe('Draft Button', () => {
  it('displays back label', () => {
    const { getByText } = render(
      <DraftButton
        showDrafts={true}
        draftCount={10}
        handleShowDrafts={() => {}}
      />,
    )

    expect(getByText(drafts.backToList)).toBeInTheDocument()
  })

  it('displays count label', () => {
    const count = 10
    const { getByText } = render(
      <DraftButton
        showDrafts={false}
        draftCount={10}
        handleShowDrafts={() => {}}
      />,
    )

    expect(getByText(drafts.myDrafts + ` (${count})`)).toBeInTheDocument()
  })
})
