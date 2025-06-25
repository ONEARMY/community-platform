import { Field, Form, FormSpy } from 'react-final-form'
import { Flex, Heading, Label, Text } from 'theme-ui'

import { buttons, form } from '../../../../src/pages/UserSettings/labels'
import { Button } from '../Button/Button'
import { FieldInput } from '../FieldInput/FieldInput'
import { Modal } from '../Modal/Modal'

export interface IProps {
  isOpen: boolean
  handleCancel: () => void
  handleConfirm: () => void
}

export const DeleteProfileModal = (props: IProps) => {
  const { deleteAccountTitle, deleteAccountMessage, deleteAccountLabel } = form
  const { confirm, cancel } = buttons.deleteAccount

  const handleFormSubmit = () => {
    props.handleConfirm()
  }

  const handleFormCancel = () => {
    props.handleCancel()
  }

  return (
    <Modal
      onDidDismiss={() => props.handleCancel}
      isOpen={props.isOpen}
      width={512}
    >
      <Flex
        data-cy="Confirm.modal: Modal"
        sx={{
          flexDirection: 'column',
          padding: 1,
          gap: 2,
          justifyContent: 'flex-start',
        }}
      >
        <Heading as="h3">{deleteAccountTitle}</Heading>

        <Text
          sx={{
            fontSize: 2,
            // TODO - Missing font size in quiet variant?
            fontFamily: '"Varela Round", Arial, sans-serif',
          }}
          variant="quiet"
        >
          {deleteAccountMessage}
        </Text>
        <Form
          onSubmit={handleFormSubmit}
          render={() => {
            return (
              <>
                <Label htmlFor="deleteInput" sx={{ marginTop: '30px' }}>
                  {deleteAccountLabel}
                </Label>
                <Field
                  id="deleteInput"
                  name="deleteInput"
                  type="text"
                  component={FieldInput}
                />
                <Flex
                  sx={{
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: '30px',
                  }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    data-cy="Confirm.modal: Cancel"
                    onClick={handleFormCancel}
                  >
                    {cancel}
                  </Button>
                  <FormSpy subscription={{ values: true }}>
                    {({ values }) => (
                      <Button
                        type="button"
                        aria-label={`Confirm Delete account action`}
                        data-cy="Confirm.modal: Confirm"
                        variant="danger"
                        disabled={values.deleteInput !== 'DELETE'}
                      >
                        {confirm}
                      </Button>
                    )}
                  </FormSpy>
                </Flex>
              </>
            )
          }}
        ></Form>
      </Flex>
    </Modal>
  )
}
