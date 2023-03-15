import { Component } from 'react'
import { Field } from 'react-final-form'
import { Button, FieldInput, Modal } from 'oa-components'
import { Text, Flex, Grid, Box } from 'theme-ui'
import { SelectField } from 'src/common/Form/Select.field'
import { validateUrl, validateEmail, required } from 'src/utils/validators'
import { formatLink } from 'src/utils/formatters'

const COM_TYPE_MOCKS = [
  {
    value: 'website',
    label: 'website',
  },
  {
    value: 'social media',
    label: 'social media',
  },
  {
    value: 'bazar',
    label: 'bazar',
  },
  {
    value: 'email',
    label: 'email',
  },
]

interface IProps {
  name: string
  index: number
  initialType?: string
  onDelete: () => void
  'data-cy'?: string
  isDeleteEnabled: boolean
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
    const { index, name, isDeleteEnabled } = this.props
    const DeleteButton = (props) => (
      <Button
        data-cy={`delete-link-${index}`}
        icon={'delete'}
        variant={'outline'}
        showIconOnly={true}
        onClick={() => this.toggleDeleteModal()}
        ml={2}
        {...props}
      >
        Delete
      </Button>
    )
    return (
      <Flex my={[2]} sx={{ flexDirection: ['column', 'column', 'row'] }}>
        <Grid mb={[1, 1, 0]} gap={0} sx={{ width: ['100%', '100%', '210px'] }}>
          <Box
            sx={{
              mr: 2,
            }}
          >
            <Field
              data-cy={`select-link-${index}`}
              name={`${name}.label`}
              options={COM_TYPE_MOCKS}
              component={SelectField}
              onCustomChange={(linkType: string) => this.setState({ linkType })}
              placeholder="type"
              validate={required}
              validateFields={[]}
              style={{ width: '100%', height: '40px' }}
            />
          </Box>
          {isDeleteEnabled ? (
            <DeleteButton
              sx={{
                display: ['block', 'block', 'none'],
              }}
              ml={'2px'}
            />
          ) : null}
        </Grid>
        <Grid
          mb={[1, 1, 0]}
          gap={0}
          columns={['auto', 'auto', 'auto']}
          sx={{ width: '100%' }}
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
        {isDeleteEnabled ? (
          <DeleteButton
            sx={{
              display: ['none', 'none', 'block'],
            }}
          />
        ) : null}
        {
          <Modal
            onDidDismiss={() => this.toggleDeleteModal()}
            isOpen={!!this.state.showDeleteModal}
          >
            <Box data-cy="Link.field: Modal">
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
                    data-cy="Link.field: Delete"
                    variant={'outline'}
                    onClick={() => this.confirmDelete()}
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </Modal>
        }
      </Flex>
    )
  }
}
