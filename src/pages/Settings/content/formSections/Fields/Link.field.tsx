import { Component } from 'react'
import { COM_TYPE_MOCKS } from 'src/mocks/Selectors'
import { Field } from 'react-final-form'
import { Button, FieldInput, Modal } from 'oa-components'
import { Text, Flex, Grid } from 'theme-ui'
import { SelectField } from 'src/components/Form/Select.field'
import { validateUrl, validateEmail, required } from 'src/utils/validators'
import { formatLink } from 'src/utils/formatters'

interface IProps {
  name: string
  index: number
  initialType?: string
  onDelete: () => void
  'data-cy'?: string
}
interface IState {
  showDeleteModal: boolean
  _toDocsList: boolean
  linkType?: string
}

export class ProfileLinkField extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showDeleteModal: false,
      _toDocsList: false,
      linkType: this.props.initialType ? this.props.initialType : '',
    }
  }

  toggleDeleteModal() {
    this.setState({ showDeleteModal: !this.state.showDeleteModal })
  }
  confirmDelete() {
    this.toggleDeleteModal()
    this.props.onDelete()
  }

  public validateDependingOnType(e) {
    switch (this.state.linkType) {
      case 'email':
        return validateEmail(e)
      case 'forum':
        return validateUrl(e)
      case 'website':
        return validateUrl(e)
      case 'social media':
        return validateUrl(e)
      case 'bazar':
        return validateUrl(e)
      default:
        return required(e)
    }
  }

  render() {
    const { index, name } = this.props
    const DeleteButton = (props) => (
      <Button
        data-cy={`delete-link-${index}`}
        icon={'delete'}
        variant={'tertiary'}
        onClick={() => this.toggleDeleteModal()}
        ml={'10px'}
        {...props}
      />
    )
    return (
      <Flex
        my={['10px', '10px', '5px']}
        sx={{ flexDirection: ['column', 'column', 'row'] }}
      >
        <Grid
          mb={[1, 1, 0]}
          gap={0}
          columns={['auto 60px', 'auto 60px', '210px']}
          sx={{ width: ['100%', '100%', '210px'] }}
        >
          <div>
            <Field
              data-cy={`select-link-${index}`}
              name={`${name}.label`}
              options={COM_TYPE_MOCKS}
              component={SelectField}
              onCustomChange={(linkType: string) => this.setState({ linkType })}
              placeholder="type"
              validate={required}
              validateFields={[]}
              style={{ width: '100%', height: '40px', marginRight: '8px' }}
            />
          </div>
          <DeleteButton
            sx={{
              display: ['block', 'block', 'none'],
              height: '40px',
              width: '50px',
            }}
            ml={'2px'}
          />
        </Grid>
        <Grid
          mb={[1, 1, 0]}
          gap={0}
          columns={['auto', 'auto', 'auto']}
          sx={{ width: ['100%', '100%', 'calc(100% - 270px)'] }}
        >
          <Field
            data-cy={`input-link-${index}`}
            name={`${name}.url`}
            validate={(value) => this.validateDependingOnType(value)}
            validateFields={[]}
            component={FieldInput}
            placeholder="Link"
            format={(v) => formatLink(v, this.state.linkType)}
            formatOnBlur={true}
            style={{ width: '100%', height: '40px', marginBottom: '0px' }}
          />
        </Grid>
        <DeleteButton
          sx={{
            display: ['none', 'none', 'block'],
            height: '40px',
            width: '50px',
          }}
        />
        {
          <Modal
            onDidDismiss={() => this.toggleDeleteModal()}
            isOpen={!!this.state.showDeleteModal}
          >
            <Text>Are you sure you want to delete this link?</Text>
            <Flex p={0} mx={-1} sx={{ justifyContent: 'flex-end' }}>
              <Flex px={1}>
                <Button
                  variant={'outline'}
                  onClick={() => this.toggleDeleteModal()}
                >
                  Cancel
                </Button>
              </Flex>
              <Flex px={1}>
                <Button
                  variant={'tertiary'}
                  onClick={() => this.confirmDelete()}
                >
                  Delete
                </Button>
              </Flex>
            </Flex>
          </Modal>
        }
      </Flex>
    )
  }
}
