import { Box, Flex, Text } from 'theme-ui'
import { Button, Modal } from '..'

export const ConfirmModal: React.FC<{
  message: string
  confirmButtonText: string
  isOpen: boolean
  handleCancel: () => void
  handleConfirm: () => void
}> = (props) => {
  const { message, confirmButtonText, isOpen } = props

  return (
    <Modal onDidDismiss={() => props?.handleCancel} isOpen={isOpen}>
      <Box data-cy="Confirm.modal: Modal">
        <Text>{message}</Text>
        <Flex p={2} mx={-1} sx={{ justifyContent: 'flex-end' }}>
          <Flex px={1}>
            <Button variant={'outline'} onClick={() => props?.handleCancel()}>
              Cancel
            </Button>
          </Flex>
          <Flex px={1}>
            <Button
              data-cy="Confirm.modal: Confirm"
              variant={'outline'}
              onClick={() => props?.handleConfirm()}
            >
              {confirmButtonText}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Modal>
  )
}
