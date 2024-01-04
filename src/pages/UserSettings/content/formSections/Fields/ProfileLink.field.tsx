import React, { useState } from 'react'
import { Field } from 'react-final-form'
import { Button, ConfirmModal, FieldInput } from 'oa-components'
import { SelectField } from 'src/common/Form/Select.field'
import { buttons, fields } from 'src/pages/UserSettings/labels'
import { formatLink } from 'src/utils/formatters'
import { required, validateEmail, validateUrl } from 'src/utils/validators'
import { Box, Flex, Grid } from 'theme-ui'

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

export const ProfileLinkField = (props: IProps) => {
  const { index, name, isDeleteEnabled } = props
  const { message, text } = buttons.deleteLink
  const [state, setState] = useState<IState>({
    showDeleteModal: false,
    _toDocsList: false,
    linkType: props.initialType ? props.initialType : '',
  })

  const toggleDeleteModal = () => {
    setState((state) => ({ ...state, showDeleteModal: !state.showDeleteModal }))
  }

  const confirmDelete = () => {
    toggleDeleteModal()
    props.onDelete()
  }

  const validateDependingOnType = (e) => {
    switch (state.linkType) {
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

  const DeleteButton = (props) => (
    <Button
      data-cy={`delete-link-${index}`}
      icon={'delete'}
      variant={'outline'}
      showIconOnly={true}
      onClick={() => toggleDeleteModal()}
      ml={2}
      {...props}
    >
      {text}
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
            onCustomChange={(linkType: string) =>
              setState((state) => ({ ...state, linkType }))
            }
            placeholder={buttons.link.type}
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
          validate={(value) => validateDependingOnType(value)}
          validateFields={[]}
          component={FieldInput}
          placeholder={fields.links.placeholder}
          format={(v) => formatLink(v, state.linkType)}
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
        <ConfirmModal
          isOpen={!!state.showDeleteModal}
          message={message}
          confirmButtonText={text}
          handleCancel={() => toggleDeleteModal()}
          handleConfirm={() => confirmDelete()}
        />
      }
    </Flex>
  )
}
