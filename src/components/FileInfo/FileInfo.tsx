import * as React from 'react'
import { bytesToSize } from '../ImageInput/ImageInput'
import type { IUploadedFileMeta } from 'src/stores/storage'
import { FileDetails } from './FileDetails'
import { ExternalLink } from 'oa-components'
import styled from '@emotion/styled'

interface IProps {
  file: File | IUploadedFileMeta | null
  allowDownload?: boolean
  handleClick?: () => Promise<void>
}

const FileContainer = styled.a`
  width: 300px;
  margin: 3px 3px;
`
export const FileInfo: React.FC<IProps> = ({
  file,
  allowDownload,
  handleClick,
}) => {
  const meta = file as IUploadedFileMeta
  const size = file ? bytesToSize(file.size) : '0'

  if (!file) {
    return null
  }

  return (
    <>
      {allowDownload && meta.downloadUrl && handleClick ? (
        <ExternalLink
          m={1}
          onClick={() => handleClick()}
          href={meta.downloadUrl}
          download={file.name}
          style={{ width: '300px' }}
        >
          <FileDetails file={file} glyph="download-cloud" size={size} />
        </ExternalLink>
      ) : (
        <FileDetails file={file} glyph="download-cloud" size={size} />
      )}
    </>
  )
}
