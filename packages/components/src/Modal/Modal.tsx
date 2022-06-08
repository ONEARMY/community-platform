export interface Props {
  isOpen: boolean
  children?: React.ReactNode
  width?: number
  height?: number
  onDidDismiss?: () => void
}

import styled from '@emotion/styled'
import { Portal } from 'react-portal'
import { Box } from 'theme-ui'

export const Modal = (props: Props) => {
  const { children, width, height, isOpen } = props

  const dismiss = () => {
    if (props.onDidDismiss) {
      props.onDidDismiss()
    }
  }

  const ModalBackdrop = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 4000;
  `
  const ModalContent = styled(Box)`
    display: block;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: ${width || 300}px;
    max-width: 100%;
    max-height: 100%;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid black;
    border-radius: 10px;
    z-index: 5000;
  `

  return (
    <>
      {isOpen && (
        <Portal>
          <ModalBackdrop onClick={() => dismiss()} />
          <ModalContent sx={{ height, width }}>{children}</ModalContent>
        </Portal>
      )}
    </>
  )
}
