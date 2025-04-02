import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { UserRole } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { FileInputField } from 'src/common/Form/FileInput.field'
import { FileDisplay } from 'src/common/Form/FileInput/FileDisplay'
import { MAX_LINK_LENGTH } from 'src/pages/constants'
import { update as updateLabels } from 'src/pages/Research/labels'
import { COMPARISONS } from 'src/utils/comparisons'
import { Flex, Label, Text } from 'theme-ui'

import type { Media } from 'src/models/image.model'

export const FilesFields = (props: {
  files: Media[]
  deleteFile: (id: string) => void
}) => {
  const { title } = updateLabels.files

  return (
    <ClientOnly fallback={<></>}>
      {() => (
        <>
          <WarningMessages show={false} />
          <Label htmlFor="files" sx={{ mb: 2 }}>
            {title}
          </Label>
          <AlreadyAddedFiles
            files={props.files}
            deleteFile={props.deleteFile}
          />
          <UploadNewFiles />
        </>
      )}
    </ClientOnly>
  )
}

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

const AlreadyAddedFiles = ({
  files,
  deleteFile,
}: {
  files: Media[]
  deleteFile: (id: string) => void
}) => {
  return (
    <Flex sx={{ flexDirection: 'column', mb: 3 }}>
      {files.map((file) => (
        <FileDisplay
          key={file.id}
          id={file.id}
          name={file.publicUrl.split('/').at(-1) || ''}
          url={file.publicUrl}
          onRemove={deleteFile}
        />
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
          placeholder={fileLink.placeholder}
          isEqual={COMPARISONS.textInput}
          maxLength={MAX_LINK_LENGTH}
          validateFields={[]}
        />
      </Flex>
    </>
  )
}
