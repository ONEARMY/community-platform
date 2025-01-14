import * as React from 'react'
import { Field } from 'react-final-form'
import { Button, DownloadStaticFile, FieldInput } from 'oa-components'
import { UserRole } from 'oa-shared'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { FileInputField } from 'src/common/Form/FileInput.field'
import { MAX_LINK_LENGTH } from 'src/pages/constants'
import { buttons, update as updateLabels } from 'src/pages/Research/labels'
import { COMPARISONS } from 'src/utils/comparisons'
import { Flex, Label, Text } from 'theme-ui'

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
      <Button
        type="button"
        variant="outline"
        icon="delete"
        data-cy="delete-file"
        onClick={deleteFile}
      >
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
        <AuthWrapper
          roleRequired={UserRole.ADMIN}
          fallback={
            <>
              <Field
                hasText={false}
                name={'files'}
                data-cy="file-input-field"
                component={FileInputField}
              />
              <Text color={'grey'} mt={4} sx={{ fontSize: 1 }}>
                {files.description}
              </Text>
            </>
          }
        >
          <>
            <Field
              hasText={false}
              name={'files'}
              data-cy="file-input-field"
              admin={true}
              component={FileInputField}
            />
            <Text color={'grey'} mt={4} sx={{ fontSize: 1 }}>
              {'Maximum file size 300MB'}
            </Text>
          </>
        </AuthWrapper>
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
