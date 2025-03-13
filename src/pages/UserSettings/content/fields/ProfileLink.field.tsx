import React, { useState } from 'react'
import { Field } from 'react-final-form'
import { Button, ConfirmModal, FieldInput } from 'oa-components'
import { ExternalLinkLabel } from 'oa-shared'
import { SelectField } from 'src/common/Form/Select.field'
import { buttons, fields } from 'src/pages/UserSettings/labels'
import { formatLink } from 'src/utils/formatters'
import { required, validateEmail, validateUrl } from 'src/utils/validators'
import { Flex } from 'theme-ui'

const COM_TYPE_MOCKS = [
  {
    value: ExternalLinkLabel.WEBSITE,
    label: ExternalLinkLabel.WEBSITE,
  },
  {
    value: ExternalLinkLabel.SOCIAL_MEDIA,
    label: ExternalLinkLabel.SOCIAL_MEDIA,
  },
  {
    value: ExternalLinkLabel.BAZAR,
    label: ExternalLinkLabel.BAZAR,
  },
  {
    value: ExternalLinkLabel.EMAIL,
    label: ExternalLinkLabel.EMAIL,
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
      case ExternalLinkLabel.EMAIL:
        return validateEmail(e)
      case ExternalLinkLabel.FORUM:
        return validateUrl(e)
      case ExternalLinkLabel.WEBSITE:
        return validateUrl(e)
      case ExternalLinkLabel.SOCIAL_MEDIA:
        return validateUrl(e)
      case ExternalLinkLabel.BAZAR:
        return validateUrl(e)
      default:
        return required(e)
    }
  }

  const DeleteButton = () => (
    <Button
      type="button"
      data-cy={`delete-link-${index}`}
      icon="delete"
      variant="outline"
      showIconOnly={true}
      onClick={() => toggleDeleteModal()}
      sx={{
        alignSelf: ['flex-start', 'flex-start', 'flex-end'],
        paddingX: 3,
        paddingBottom: 4,
        height: '2rem',
      }}
      small
    >
      {text}
    </Button>
  )

  return (
    <Flex
      sx={{
        flexDirection: ['column', 'column', 'row'],
        alignItems: ['stretch', 'stretch', 'flex-end'],
        justifyContent: ['stretch'],
        gap: [1, 2],
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
        sx={{ flex: 3 }}
      />
      <Field
        data-cy={`input-link-${index}`}
        name={`${name}.url`}
        validate={(value) => validateDependingOnType(value)}
        validateFields={[]}
        component={FieldInput}
        placeholder={fields.links.placeholder}
        format={(v) => formatLink(v, state.linkType)}
      />
      {isDeleteEnabled ? <DeleteButton /> : null}
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
