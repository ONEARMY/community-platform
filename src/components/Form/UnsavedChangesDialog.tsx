import { memo, useState } from 'react'
import { FormSpy } from 'react-final-form'
import { Prompt } from 'react-router'

interface IProps {
  uploadComplete: boolean
}

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'

// Display a confirmation dialog when leaving the page outside the React Router
// Use memo to only re-render if props change
export const UnsavedChangesDialog = memo((props: IProps) => {
  const [formIsDirty, setFormIsDirty] = useState(false)
  const shouldPromptUnsavedChanges = formIsDirty && !props.uploadComplete
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
