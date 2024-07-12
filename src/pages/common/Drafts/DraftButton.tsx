import { Button } from 'oa-components'

import { drafts } from '../labels'

type DraftButtonProps = {
  showDrafts: boolean
  draftCount: number
  handleShowDrafts: () => void
}

const DraftButton = ({
  showDrafts,
  draftCount,
  handleShowDrafts,
}: DraftButtonProps) => {
  if (!draftCount) {
    return <></>
  }

  return (
    <Button
      type="button"
      variant="secondary"
      icon={showDrafts ? 'arrow-back' : undefined}
      data-cy="my-drafts"
      onClick={() => handleShowDrafts()}
    >
      {showDrafts ? (
        <>{drafts.backToList}</>
      ) : (
        <>
          {drafts.myDrafts} {draftCount ? `(${draftCount})` : ''}
        </>
      )}
    </Button>
  )
}

export default DraftButton
