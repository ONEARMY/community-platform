import React, { useState, FunctionComponent } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { TEXT } from '../common'
import { CancelButton, ConfirmButton, DialogButtons } from './elements.js'

interface IFormDialog {
  onCancel: () => void
  onOk: () => void
  valid: boolean
  title: string
}

/**
 * Basic ok/cancel dialog
 *
 * @param {*} {
 *   title,
 *   onCancel,
 *   onOk,
 *   children, // dialog content
 *   valid, // will switch the confirmation button into disable
 * }
 */
export const FormDialog: FunctionComponent<IFormDialog> = ({
  title,
  onCancel,
  onOk,
  children,
  valid,
}) => {
  const [open, setOpen] = useState(true)

  const close = () => {
    setOpen(false)
    onCancel()
  }

  const ok = () => {
    setOpen(false)
    onOk()
  }

  return (
    <div>
      <Dialog open={open} onClose={close} aria-labelledby={title}>
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>{children}</DialogContent>
        <DialogButtons>
          <CancelButton onClick={close} color="primary">
            {TEXT.UPLOAD_CANCEL}
          </CancelButton>
          <ConfirmButton onClick={ok} disabled={!valid}>
            {TEXT.UPLOAD_OK}
          </ConfirmButton>
        </DialogButtons>
      </Dialog>
    </div>
  )
}
