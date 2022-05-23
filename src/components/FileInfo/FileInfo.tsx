import * as React from 'react'
import { bytesToSize } from '../ImageInput/ImageInput'
import type { IUploadedFileMeta } from 'src/stores/storage'
import { FileDetails } from './FileDetails'
import { ExternalLink } from 'oa-components'
import styled from '@emotion/styled'
import { useCommonStores } from 'src/index'

interface IProps {
  file: File | IUploadedFileMeta | null
  allowDownload?: boolean
  howToID?: string
  setFileDownloadCount?(val: number | undefined): void
}

const FileContainer = styled.a`
  width: 300px;
  margin: 3px 3px;
`
export const FileInfo: React.FC<IProps> = ({
  file,
  allowDownload,
  howToID,
  setFileDownloadCount,
}) => {
  const { stores } = useCommonStores()
  const meta = file as IUploadedFileMeta
  const size = file ? bytesToSize(file.size) : '0'

  if (!file) {
    return null
  }

  const handleClick = async () => {
    if (howToID && setFileDownloadCount) {
      const updatedDownloadCount =
        await stores.howtoStore.incrementDownloadCount(howToID)
      setFileDownloadCount(updatedDownloadCount)
    }
  }

  return (
    <>
      {allowDownload && meta.downloadUrl ? (
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
