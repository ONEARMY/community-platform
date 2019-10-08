import * as React from 'react'
import { Modal } from 'src/components/Modal/Modal'
import { Button } from 'src/components/Button'
import Text from 'src/components/Text'
import { Form, Field } from 'react-final-form'
import { InputField } from 'src/components/Form/Fields'
import Flex from 'src/components/Flex'

interface IState {
  showDeleteDialog: boolean
}
interface IProps {
  onConfirmation: (reauthPw: string) => void
}
export class ProfileDelete extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showDeleteDialog: false,
    }
  }
  onModalDismiss(values: any) {
    const reauthPw = values.password
    this.setState({ showDeleteDialog: false })
    if (reauthPw) {
      this.props.onConfirmation(reauthPw)
    }
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
        {this.state.showDeleteDialog && (
          <Modal onDidDismiss={confirm => this.onModalDismiss(confirm)}>
            <Text>Confirm your password to delete your account</Text>
            <Form
              onSubmit={values => this.onModalDismiss(values)}
              render={({ values, handleSubmit }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Field
                      name="password"
                      component={InputField}
                      type="password"
                    />
                    <Flex p={0}>
                      <Button
                        style={{ marginLeft: 'auto' }}
                        variant="secondary"
                        onClick={() => this.onModalDismiss({})}
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
        )}
      </>
    )
  }

  static defaultProps: IProps = {
    onConfirmation: () => null,
  }
}
