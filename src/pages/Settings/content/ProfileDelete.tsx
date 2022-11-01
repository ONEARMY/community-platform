import * as React from 'react'
import { Button, FieldInput, Modal } from 'oa-components'
import { Text, Flex } from 'theme-ui'
import { Form, Field } from 'react-final-form'

interface IState {
  showDeleteDialog: boolean
}
interface IProps {
  onConfirmation: (reauthPw: string) => void
}
export class ProfileDelete extends React.Component<IProps, IState> {
  static defaultProps: IProps = {
    onConfirmation: () => null,
  }
  constructor(props: IProps) {
    super(props)
    this.state = {
      showDeleteDialog: false,
    }
  }

  handleSubmit(values: any) {
    const reauthPw = values.password
    if (reauthPw) {
      this.props.onConfirmation(reauthPw)
    }
  }

  onModalDismiss() {
    this.setState({ showDeleteDialog: false })
  }

  render() {
    return (
      <>
        <Button
          icon="delete"
          variant="tertiary"
          my={3}
          onClick={() => this.setState({ showDeleteDialog: true })}
        >
          Delete Profile
        </Button>

        <Modal
          onDidDismiss={() => this.onModalDismiss()}
          isOpen={!!this.state.showDeleteDialog}
        >
          <Text>Confirm your password to delete your account</Text>
          <Form
            onSubmit={(values) => {
              this.onModalDismiss()
              this.handleSubmit(values)
            }}
            render={({ values, handleSubmit }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Field
                    name="password"
                    component={FieldInput}
                    type="password"
                  />
                  <Flex p={0}>
                    <Button
                      style={{ marginLeft: 'auto' }}
                      variant="secondary"
                      onClick={() => this.onModalDismiss()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="tertiary"
                      ml={1}
                      disabled={values.password ? false : true}
                    >
                      Delete
                    </Button>
                  </Flex>
                </form>
              )
            }}
          />
        </Modal>
      </>
    )
  }
}
