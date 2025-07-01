import { Field, Form, FormSpy } from 'react-final-form'
import { Flex, Heading, Label, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { FieldInput } from '../FieldInput/FieldInput'
import { Modal } from '../Modal/Modal'

export interface IProps {
  isOpen: boolean
  handleCancel: () => void
  handleConfirm: () => void
}

export const DeleteProfileModal = (props: IProps) => {
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
        data-cy="delete-account-modal-container"
        sx={{
          flexDirection: 'column',
          padding: 1,
          gap: 2,
          justifyContent: 'flex-start',
        }}
      >
        <Heading as="h3">Permanently delete this account?</Heading>

        <Text
          sx={{
            fontSize: 2,
            // TODO - Missing font size in quiet variant?
            fontFamily: '"Varela Round", Arial, sans-serif',
          }}
          variant="quiet"
        >
          Deleting your account will remove all your information from our
          database. This cannot be undone.
        </Text>
        <Form
          onSubmit={() => {}}
          render={() => {
            return (
              <>
                <Label htmlFor="deleteInput" sx={{ marginTop: '30px' }}>
                  Type “DELETE” to proceed
                </Label>
                <Field
                  id="deleteInput"
                  name="deleteInput"
                  type="text"
                  data-cy="delete-account-modal-confirmation-input"
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
                    data-cy="delete-account-modal-cancel-button"
                    onClick={handleFormCancel}
                  >
                    Cancel
                  </Button>
                  <FormSpy subscription={{ values: true }}>
                    {({ values }) => (
                      <Button
                        type="button"
                        aria-label={`Confirm Delete account action`}
                        data-cy="delete-account-modal-confirm-button"
                        variant="danger"
                        disabled={values.deleteInput !== 'DELETE'}
                        onClick={handleFormSubmit}
                      >
                        Delete account
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
