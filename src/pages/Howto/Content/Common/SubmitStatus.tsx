import React from 'react'
import { observer } from 'mobx-react'
import { SubmitStatusModal } from 'src/common/Form/SubmitStatusModal'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import { buttons, headings } from '../../labels'

interface IProps {
  onClose: () => void
}

export const HowToSubmitStatus = observer((props: IProps) => {
  const { howtoStore } = useCommonStores().stores
  const uploadStatus = howtoStore.uploadStatus

  return (
    <SubmitStatusModal
      title={headings.uploading}
      status={uploadStatus}
      url={'/how-to/' + howtoStore.activeHowto!.slug}
      buttonLabel={buttons.view}
      onClose={props.onClose}
    />
  )
})
