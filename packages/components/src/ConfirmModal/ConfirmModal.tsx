import { Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { Modal } from '../Modal/Modal'

export interface Props {
  message: string
  confirmButtonText: string
  isOpen: boolean
  handleCancel: () => void
  handleConfirm: () => void
  width?: number
}

export const ConfirmModal = (props: Props) => {
  const { message, confirmButtonText, isOpen, width } = props

  return (
    <Modal
      onDidDismiss={() => props?.handleCancel}
      isOpen={isOpen}
      width={width}
    >
      <Flex
        data-cy="Confirm.modal: Modal"
        sx={{
          alignItems: 'flex-start',
          flexDirection: 'column',
          padding: 1,
          gap: 2,
          justifyContent: 'flex-start',
        }}
      >
        <Text sx={{ alignSelf: 'stretch', fontWeight: 'bold' }}>{message}</Text>
        <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Button
            type="button"
            variant="outline"
            data-cy="Confirm.modal: Cancel"
            onClick={() => props?.handleCancel()}
          >
            Cancel
          </Button>

          <Button
            type="button"
            aria-label={`Confirm ${confirmButtonText} action`}
            data-cy="Confirm.modal: Confirm"
            variant={'outline'}
            onClick={() => props?.handleConfirm()}
          >
            {confirmButtonText}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
