import { DownloadStaticFile } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { Flex, Text } from 'theme-ui'

import { headings, intro } from '../../labels'
import { LibraryFileLinkField } from './LibraryFileLink.field'
import { LibraryFileUploadField } from './LibraryFileUpload.field'

interface IProps {
  fileEditMode: boolean | undefined
  files: any['files']
  onClick: () => void
  showInvalidFileWarning: boolean
}

export const LibraryFilesField = (props: IProps) => {
  const { onClick, showInvalidFileWarning, files, fileEditMode } = props

  return (
    <>
      <Flex sx={{ mb: 2 }}>{showInvalidFileWarning && <Error />}</Flex>
      <FormFieldWrapper htmlFor="description" text={headings.files}>
        <Flex sx={{ flexDirection: 'column' }} mb={[4, 4, 0]}>
          {files?.length && !fileEditMode ? (
            <FilesWrapper files={files} onClick={onClick} />
          ) : (
            <>
              <LibraryFileLinkField />
              <LibraryFileUploadField />
            </>
          )}
        </Flex>
      </FormFieldWrapper>
    </>
  )
}

const Error = () => {
  return (
    <Text
      id="invalid-file-warning"
      data-cy="invalid-file-warning"
      data-testid="invalid-file-warning"
      sx={{
        color: 'error',
      }}
    >
      {intro.files.error}
    </Text>
  )
}

const FilesList = ({ files }) => {
  return (
    <>
      {files.map((file) => (
        <DownloadStaticFile allowDownload file={file} key={file.name} />
      ))}
    </>
  )
}

const FilesWrapper = ({ files, onClick }) => {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <FilesList files={files} />
    </Flex>
  )
}
