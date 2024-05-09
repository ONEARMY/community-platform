import { observer } from 'mobx-react'
import { SubmitStatusModal } from 'src/common/Form/SubmitStatusModal'
import { useResearchStore } from 'src/stores/Research/research.store'

interface IProps {
  onClose: () => void
}

export const ResearchSubmitStatus = observer((props: IProps) => {
  const store = useResearchStore()
  const uploadStatus = store.updateUploadStatus

  const url = store.activeResearchItem?.slug
    ? '/research/' + store.activeResearchItem.slug
    : undefined

  return (
    <SubmitStatusModal
      title="Uploading Research"
      status={uploadStatus}
      url={url}
      buttonLabel="View Research"
      onClose={props.onClose}
    />
  )
})

export const UpdateSubmitStatus = observer((props: IProps) => {
  const store = useResearchStore()
  const uploadStatus = store.updateUploadStatus

  const url = '/research/' + store.activeResearchItem!.slug

  return (
    <SubmitStatusModal
      title="Uploading Research"
      status={uploadStatus}
      url={url}
      buttonLabel="View Research"
      onClose={props.onClose}
    />
  )
})
