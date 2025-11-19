import { useBlocker } from 'react-router';
import { ConfirmModal } from 'oa-components'

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'

/**
 * When places inside a react-final-form <Form> element watches for form pristine/dirty
 * change and handles router and window confirmation if form contains changes
 **/
type IProps = {
  hasChanges: boolean
}

export const UnsavedChangesDialog = ({ hasChanges }: IProps) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasChanges && currentLocation !== nextLocation,
  )

  return (
    <ConfirmModal
      isOpen={blocker.state === 'blocked'}
      message={CONFIRM_DIALOG_MSG}
      confirmButtonText="Yes"
      handleCancel={() => blocker.reset && blocker.reset()}
      handleConfirm={() => blocker.proceed && blocker.proceed()}
    />
  )
}
