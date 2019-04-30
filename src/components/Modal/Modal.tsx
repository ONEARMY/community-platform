import * as React from 'react'
import { Portal } from 'react-portal'
import styled from 'styled-components'

interface IProps {
  onDidDismiss: () => void
}
interface IState {
  isOpen: boolean
}

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background: rgba(0, 0, 0, 0.4);
`
const ModalContent = styled.div`
  display: block;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  max-width: 100%;
  height: 200px;
  max-height: 100%;
  position: fixed;
  z-index: 10;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  box-shadow: 0 0 100px 10px rgba(0, 0, 0, 0.4);
`
export class Modal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { isOpen: true }
  }

  dismiss() {
    if (this.props.onDidDismiss) {
      this.props.onDidDismiss()
    }
  }

  render() {
    const isOpen = this.state
    return (
      isOpen && (
        <Portal id="portal">
          <ModalBackdrop id="ModalBackdrop" onClick={() => this.dismiss()} />
          <ModalContent id="ModalContent">{this.props.children}</ModalContent>
        </Portal>
      )
    )
  }
}
