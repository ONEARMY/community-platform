import { Portal } from 'react-portal'
import styled from '@emotion/styled'
import { Box } from 'theme-ui'

import type { ThemeUIStyleObject } from 'theme-ui'

export interface Props {
  isOpen: boolean
  children?: React.ReactNode
  width?: number
  height?: number
  onDidDismiss?: () => void
  sx?: ThemeUIStyleObject | undefined
}

export const Modal = (props: Props) => {
  const { children, width, height, isOpen, sx } = props

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
    max-width: 100vw;
    max-height: 100vh;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid black;
    border-radius: 12px;
    z-index: 4001;
  `

  return (
    <>
      {isOpen && (
        <Portal>
          <ModalBackdrop onClick={() => dismiss()} />
          <ModalContent sx={{ height, width, ...sx }}>{children}</ModalContent>
        </Portal>
      )}
    </>
  )
}
