import * as React from 'react'
import { Portal } from 'react-portal'
import { Box } from 'theme-ui'
import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'

interface IProps {
  // provide onDidDismiss function to enable backdrop click dismiss
  onDidDismiss: (data?: any) => void
  height?: number
  width?: number
}
interface IState {
  isOpen: boolean
}

const ModalBackdrop = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${theme.zIndex.modalBackdrop};
  background: rgba(0, 0, 0, 0.4);
`
const ModalContent = styled(Box)`
  display: block;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  max-width: 100%;
  max-height: 100%;
  position: fixed;
  z-index: ${theme.zIndex.modalContent};
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 2px solid black;
  border-radius: 10px;
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
    const { height, width, children } = this.props
    return (
      isOpen && (
        <Portal id="portal">
          <ModalBackdrop id="ModalBackdrop" onClick={() => this.dismiss()} />
          <ModalContent id="ModalContent" sx={{ height, width }}>
            {children}
          </ModalContent>
        </Portal>
      )
    )
  }
  static defaultProps: IProps = {
    onDidDismiss: () => null,
  }
}
