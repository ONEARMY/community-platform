import { type PropsWithChildren } from 'react'
import { Field, Form } from 'react-final-form'
import { Flex, Heading, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { Modal } from '../Modal/Modal'

export interface IProps {
  title?: string
  message: string
  confirmButtonText: string
  confirmButtonVariant?: string
  isOpen: boolean
  handleCancel: () => void
  handleConfirm: () => void
  disableConfirm?: boolean
  width?: number
}

export const ConfirmModalWithForm = (props: PropsWithChildren<IProps>) => {
  const {
    title,
    message,
    confirmButtonText,
    confirmButtonVariant = 'outline',
    disableConfirm = false,
    isOpen,
    width,
  } = props

  const handleFormSubmit = () => {
    props?.handleConfirm()
  }

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
        {title && (
          <Heading as="h3" sx={{}}>
            {title}
          </Heading>
        )}
        <Text sx={{ alignSelf: 'stretch', fontWeight: 'bold' }} variant="quiet">
          {message}
        </Text>
        <Form
          onSubmit={() => {}}
          render={() => {
            return (
              <>
                {props.children}

                <Flex
                  sx={{
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
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
                    variant={confirmButtonVariant}
                    disabled={disableConfirm}
                    onClick={() => props?.handleConfirm()}
                  >
                    {confirmButtonText}
                  </Button>
                </Flex>
              </>
            )
          }}
        ></Form>
      </Flex>
    </Modal>
  )
}
