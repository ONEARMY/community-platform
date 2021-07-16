import { memo, useState } from 'react'
import { FormSpy } from 'react-final-form'
import { Prompt } from 'react-router'

interface IProps {
  uploadComplete?: boolean
}

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'

const beforeUnload = function(e) {
  e.preventDefault()
  e.returnValue = CONFIRM_DIALOG_MSG
}

/**
 * When places inside a react-final-form <Form> element watches for form pristine/dirty
 * change and handles router and window confirmation if form contains changes
 **/
export const UnsavedChangesDialog = memo((props: IProps) => {
  // Use memo to only re-render if props change
  const [formIsDirty, setFormIsDirty] = useState(false)
  const shouldPromptUnsavedChanges = formIsDirty && !props.uploadComplete
  // Handle confirmation outside React Router
  if (shouldPromptUnsavedChanges) {
    window.addEventListener('beforeunload', beforeUnload, false)
  } else {
    window.removeEventListener('beforeunload', beforeUnload, false)
  }
  // Handle confirmaiton inside react route
  return (
    <>
      <FormSpy
        subscription={{ dirty: true }}
        onChange={form => {
          setFormIsDirty(form.dirty)
        }}
        render={() => null}
      />
      {/* Render a blocking screen prompt to prevent user leaving page via react navigation */}
      <Prompt when={shouldPromptUnsavedChanges} message={CONFIRM_DIALOG_MSG} />
    </>
  )
})
UnsavedChangesDialog.displayName = 'UnsavedChangesDialog'
