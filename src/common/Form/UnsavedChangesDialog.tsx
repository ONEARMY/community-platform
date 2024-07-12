import { memo, useState } from 'react'
import { FormSpy } from 'react-final-form'

import { useBlocker } from 'react-router'
import { ConfirmModal } from 'oa-components'

interface IProps {
  uploadComplete?: boolean
  message?: string
}

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'

/**
 * When places inside a react-final-form <Form> element watches for form pristine/dirty
 * change and handles router and window confirmation if form contains changes
 **/
export const UnsavedChangesDialog = memo((props: IProps) => {
  // Use memo to only re-render if props change
  const [formIsDirty, setFormIsDirty] = useState(false)
  const shouldPromptUnsavedChanges = formIsDirty && !props.uploadComplete
  const message = props.message || CONFIRM_DIALOG_MSG

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldPromptUnsavedChanges &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  // Handle confirmaiton inside react route
  return (
    <>
      <FormSpy
        subscription={{ dirty: true }}
        onChange={(form) => {
          setFormIsDirty(form.dirty)
        }}
        render={() => null}
      />
      <ConfirmModal
        isOpen={blocker.state === 'blocked'}
        message={message}
        confirmButtonText="Yes"
        handleCancel={() => blocker.reset && blocker.reset()}
        handleConfirm={() => blocker.proceed && blocker.proceed()}
      />
    </>
  )
})
UnsavedChangesDialog.displayName = 'UnsavedChangesDialog'
