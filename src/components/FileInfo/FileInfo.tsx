import * as React from 'react'
import { bytesToSize } from '../ImageInput/ImageInput'
import { IUploadedFileMeta } from 'src/stores/storage'
import { FileDetails } from './FileDetails'
import styled from '@emotion/styled'

interface IProps {
  file: File | IUploadedFileMeta | null
  allowDownload?: boolean
}

const FileContainer = styled.a`
  width: 300px;
  margin: 3px 3px;
`
export const FileInfo: React.FC<IProps> = ({ file, allowDownload }) => {
  const meta = file as IUploadedFileMeta
  const size = file ? bytesToSize(file.size) : '0'

  if (!file) {
    return null
  }

  return (
    <>
      {allowDownload && meta.downloadUrl ? (
        <FileContainer
          href={meta.downloadUrl}
          target="_blank"
          download={file.name}
        >
          <FileDetails file={file} glyph="download-cloud" size={size} />
        </FileContainer>
      ) : (
        <FileDetails file={file} glyph="download-cloud" size={size} />
      )}
    </>
  )
}
