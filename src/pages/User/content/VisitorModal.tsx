import { UserVisitorPreference } from 'oa-shared'
import { Modal } from 'oa-components'
import { useState } from 'react'

export interface IProps {
  show: boolean
  hide: () => void
  openToVisitors: UserVisitorPreference
}

export const VisitorModal = ({ show, hide, openToVisitors }: IProps) => {
  return (
    <Modal isOpen={show} onDidDismiss={hide}>
      {openToVisitors.details}
    </Modal>
  )
}
