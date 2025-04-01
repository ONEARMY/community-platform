import { Field } from 'react-final-form'
import { Button, DownloadStaticFile, FieldInput } from 'oa-components'
import { UserRole } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { FileInputField } from 'src/common/Form/FileInput.field'
import { MAX_LINK_LENGTH } from 'src/pages/constants'
import { buttons, update as updateLabels } from 'src/pages/Research/labels'
import { COMPARISONS } from 'src/utils/comparisons'
import { Box, Flex, Label, Text } from 'theme-ui'

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

const AlreadyAddedFiles = ({ files, deleteFile }) => {
  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center', mb: 3 }}>
      {files.map((file, index) => (
        <Box key={file.id}>
          <DownloadStaticFile allowDownload file={file} key={file.name} />
          <Button
            type="button"
            variant="outline"
            icon="delete"
            data-cy="delete-file"
            onClick={deleteFile(index)}
          >
            {buttons.files}
          </Button>
        </Box>
      ))}
    </Flex>
  )
}

const UploadNewFiles = () => {
  const { fileLink, files } = updateLabels
  const identity = 'file-download-link'

  return (
    <>
      <Flex sx={{ flexDirection: 'column', mb: 3 }}>
        <Label htmlFor={identity} sx={{ fontSize: '12px', mb: 2 }}>
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
      <Flex sx={{ flexDirection: 'column', mb: 3 }}>
        <Label htmlFor={identity} sx={{ fontSize: '12px', mb: 2 }}>
          {files.title}
        </Label>

        <AuthWrapper
          roleRequired={UserRole.ADMIN}
          fallback={
            <>
              <Field
                hasText={false}
                name="files"
                data-cy="file-input-field"
                component={FileInputField}
              />
              <Text sx={{ fontSize: 1, color: 'grey', mt: 4 }}>
                {files.description}
              </Text>
            </>
          }
        >
          <Field
            hasText={false}
            name="files"
            data-cy="file-input-field"
            admin={true}
            component={FileInputField}
          />
          <Text sx={{ fontSize: 1, color: 'grey', mt: 4 }}>
            Maximum file size 300MB
          </Text>
        </AuthWrapper>
      </Flex>
    </>
  )
}

export const FilesFields = ({ files, deleteFile, showInvalidFileWarning }) => {
  const { title } = updateLabels.files

  return (
    <ClientOnly fallback={<></>}>
      {() => (
        <>
          <WarningMessages show={showInvalidFileWarning} />
          <Label htmlFor="files" sx={{ mb: 2 }}>
            {title}
          </Label>
          <AlreadyAddedFiles files={files} deleteFile={deleteFile} />
          <UploadNewFiles />
        </>
      )}
    </ClientOnly>
  )
}
