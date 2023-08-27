import { Button, DownloadStaticFile } from 'oa-components'
import { Flex, Text } from 'theme-ui'

import { intro } from '../../labels'
import { FormFieldWrapper, HowtoFieldFileLink, HowtoFieldFileUpload } from '.'

const { error, title, upload } = intro.files

import type { IHowtoFormInput } from 'src/models/howto.models'

interface IProps {
  fileEditMode: boolean | undefined
  files: IHowtoFormInput['files']
  onClick: () => void
  showInvalidFileWarning: boolean
}

export const HowtoFieldFiles = (props: IProps) => {
  const { onClick, showInvalidFileWarning, files, fileEditMode } = props

  return (
    <>
      <Flex sx={{ mb: 2 }}>{showInvalidFileWarning && <Error />}</Flex>
      <FormFieldWrapper htmlFor="description" text={title}>
        <Flex sx={{ flexDirection: 'column' }} mb={[4, 4, 0]}>
          {files?.length && !fileEditMode ? (
            <FilesWrapper files={files} onClick={onClick} />
          ) : (
            <>
              <HowtoFieldFileLink />
              <HowtoFieldFileUpload />
            </>
          )}
        </Flex>
      </FormFieldWrapper>
    </>
  )
}

const DeleteButton = ({ onClick }) => {
  return (
    <Button
      data-testid="re-upload-files"
      variant={'outline'}
      icon="delete"
      onClick={() => onClick()}
    >
      {upload.warning}
    </Button>
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
      {error}
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
      <DeleteButton onClick={() => onClick()} />
    </Flex>
  )
}
