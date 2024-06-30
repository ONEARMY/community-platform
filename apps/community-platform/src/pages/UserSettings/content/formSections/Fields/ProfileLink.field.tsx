import React, { useState } from 'react'
import { Field } from 'react-final-form'
import { Button, ConfirmModal, FieldInput } from '@onearmy.apps/components'
import { ExternalLinkLabel } from '@onearmy.apps/shared'
import { Box, Flex, Grid } from 'theme-ui'

import { SelectField } from '../../../../../common/Form/Select.field'
import { buttons, fields } from '../../../../../pages/UserSettings/labels'
import { formatLink } from '../../../../../utils/formatters'
import {
  required,
  validateEmail,
  validateUrl,
} from '../../../../../utils/validators'

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
