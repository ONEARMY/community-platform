import * as React from 'react'
import { Field } from 'react-final-form'
import {
  Button,
  DownloadStaticFile,
  FieldInput,
} from '@onearmy.apps/components'
import { Flex, Label, Text } from 'theme-ui'

import { FileInputField } from '../../../../../common/Form/FileInput.field'
import { MAX_LINK_LENGTH } from '../../../../../pages/constants'
import {
  buttons,
  update as updateLabels,
} from '../../../../../pages/Research/labels'
import { COMPARISONS } from '../../../../../utils/comparisons'

const WarningMessages = ({ show }) => {
  const { error } = updateLabels.files

  return (
    <Flex sx={{ mb: 2 }}>
      {show && (
        <Text
          id="invalid-file-warning"
          data-cy="invalid-file-warning"
          data-testid="invalid-file-warning"
          sx={{
            color: 'error',
          }}
        >
          {error}
        </Text>
      )}
    </Flex>
  )
}

const AlreadyAddedFiles = ({ formValues, setFileEditMode }) => {
  const deleteFile = () => {
    formValues.files = []
    setFileEditMode(true)
  }

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center' }} mb={3}>
      {formValues.files.map((file) => (
        <DownloadStaticFile allowDownload file={file} key={file.name} />
      ))}
      <Button variant={'outline'} icon="delete" onClick={deleteFile}>
        {buttons.files}
      </Button>
    </Flex>
  )
}

const UploadNewFiles = () => {
  const { fileLink, files } = updateLabels

  const identity = 'file-download-link'
  return (
    <>
      <Flex sx={{ flexDirection: 'column' }} mb={3}>
        <Label mb={2} htmlFor={identity} style={{ fontSize: '12px' }}>
          {fileLink.title}
        </Label>
        <Field
          id="fileLink"
          name="fileLink"
          data-cy="fileLink"
          component={FieldInput}
          placeholder={fileLink.placeholder}
          isEqual={COMPARISONS.textInput}
          maxLength={MAX_LINK_LENGTH}
          validateFields={[]}
          mb={2}
        />
      </Flex>
      <Flex sx={{ flexDirection: 'column' }} mb={3}>
        <Label mb={2} htmlFor={identity} style={{ fontSize: '12px' }}>
          {files.title}
        </Label>
        <Field hasText={false} name={'files'} component={FileInputField} />
        <Text color={'grey'} mt={4} sx={{ fontSize: 1 }}>
          {files.description}
        </Text>
      </Flex>
    </>
  )
}

export const FilesFields = ({
  showInvalidFileWarning,
  formValues,
  parentType,
}) => {
  const [fileEditMode, setFileEditMode] = React.useState(false)
  const isEditMode =
    formValues.files?.length > 0 && parentType === 'edit' && !fileEditMode

  const { title } = updateLabels.files

  return (
    <>
      <WarningMessages show={showInvalidFileWarning} />
      <Label htmlFor="files" mb={2}>
        {title}
      </Label>
      {isEditMode ? (
        <AlreadyAddedFiles
          formValues={formValues}
          setFileEditMode={setFileEditMode}
        />
      ) : (
        <UploadNewFiles />
      )}
    </>
  )
}
