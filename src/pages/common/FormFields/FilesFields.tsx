import { Field, useForm, useFormState } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { UserRole } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { FileInputField } from 'src/common/Form/FileInput.field'
import { FileDisplay } from 'src/common/Form/FileInput/FileDisplay'
import { MAX_LINK_LENGTH } from 'src/pages/constants'
import { COMPARISONS } from 'src/utils/comparisons'
import { Flex, Label, Text } from 'theme-ui'

import { fileLabels } from './labels'

import type { IFilesForm, MediaFile, ProjectFormData } from 'oa-shared'

export const FilesFields = () => {
  const state = useFormState<IFilesForm>()
  const form = useForm<ProjectFormData>()
  const hasBothError = !!(
    (state.values?.existingFiles?.length || state.values?.files?.length) &&
    state.values.fileLink
  )

  return (
    <ClientOnly fallback={<></>}>
      {() => (
        <>
          <WarningMessages show={hasBothError} />
          <Label htmlFor="files" sx={{ mb: 2 }}>
            {fileLabels.files.title}
          </Label>
          <AlreadyAddedFiles
            files={state.values.existingFiles || []}
            deleteFile={(id) => {
              form.change(
                'existingFiles',
                state.values.existingFiles?.filter((x) => x.id !== id),
              )
            }}
          />
          <UploadNewFiles />
        </>
      )}
    </ClientOnly>
  )
}

const WarningMessages = ({ show }) => {
  const { error } = fileLabels.files

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

const AlreadyAddedFiles = ({
  files,
  deleteFile,
}: {
  files: MediaFile[]
  deleteFile: (id: string) => void
}) => {
  return (
    <Flex sx={{ flexDirection: 'column', mb: 3 }}>
      {files.map((file) => (
        <FileDisplay
          key={file.id}
          file={file}
          onRemove={() => deleteFile(file.id)}
        />
      ))}
    </Flex>
  )
}

const UploadNewFiles = () => {
  const { fileLink, files } = fileLabels
  const identity = 'file-download-link'

  return (
    <>
      <Flex sx={{ flexDirection: 'column', mb: 3 }}>
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
              <Text sx={{ fontSize: 1, color: 'grey', mt: 1 }}>
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
          <Text sx={{ fontSize: 1, color: 'grey', mt: 1 }}>
            Maximum file size 300MB
          </Text>
        </AuthWrapper>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Label htmlFor={identity} sx={{ fontSize: 1, mb: 2 }}>
          {fileLink.title}
        </Label>
        <Field
          id="fileLink"
          name="fileLink"
          data-cy="fileLink"
          component={FieldInput}
          isEqual={COMPARISONS.textInput}
          maxLength={MAX_LINK_LENGTH}
          placeholder={fileLink.placeholder}
          validateFields={[]}
        />
      </Flex>
    </>
  )
}
