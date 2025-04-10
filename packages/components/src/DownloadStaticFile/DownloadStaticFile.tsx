import { Flex, Text } from 'theme-ui'

import { DownloadButton } from '../DownloadButton/DownloadButton'
import { ExternalLink } from '../ExternalLink/ExternalLink'
import { Icon } from '../Icon/Icon'
import { Tooltip } from '../Tooltip/Tooltip'

import type { MediaFile } from 'oa-shared'
import type { availableGlyphs } from '../Icon/types'

export interface IProps {
  file: MediaFile
  fileDownloadCount?: number
  forDonationRequest?: boolean
  isLoggedIn?: boolean
  allowDownload?: boolean
  handleClick?: () => void
  redirectToSignIn?: () => Promise<void>
}

interface IPropFileDetails {
  name: string
  glyph: availableGlyphs
  size: string
  redirectToSignIn?: () => Promise<void>
}

const FileDetails = (props: IPropFileDetails) => {
  const { name, glyph, size, redirectToSignIn } = props

  return (
    <>
      <Flex
        sx={{
          borderRadius: 1,
          border: '2px solid black',
          background: 'accent.base',
          color: 'black',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          width: '300px',
          cursor: 'pointer',
          p: 2,
          mb: 1,
        }}
        onClick={() => redirectToSignIn && redirectToSignIn()}
        data-tooltip-id="login-download"
        data-tooltip-content={redirectToSignIn ? 'Login to download' : ''}
      >
        <Icon size={24} glyph={glyph} mr={3} />
        <Text
          sx={{
            flex: 1,
            fontSize: 1,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            mr: 3,
          }}
        >
          {name}
        </Text>
        <Text sx={{ fontSize: 1 }}>{size}</Text>
      </Flex>
      <Tooltip id="login-download" />
    </>
  )
}

export const DownloadStaticFile = (props: IProps) => {
  const {
    file,
    fileDownloadCount,
    allowDownload,
    handleClick,
    redirectToSignIn,
    isLoggedIn,
  } = props
  const size = bytesToSize(file.size || 0)

  if (!file) {
    return null
  }

  const forDownload = allowDownload && file.url && !redirectToSignIn

  return (
    <>
      {forDownload && (
        <ExternalLink
          onClick={() => handleClick && handleClick()}
          href={file.url}
          download={file.name}
          sx={{ width: '300px', ml: 0, mr: 1 }}
        >
          <FileDetails name={file.name} glyph="download-cloud" size={size} />
        </ExternalLink>
      )}

      <DownloadButton
        fileDownloadCount={fileDownloadCount}
        glyph="download-cloud"
        isLoggedIn={isLoggedIn}
        label={`${file.name} (${size})`}
        onClick={() => handleClick && handleClick()}
      />
    </>
  )
}

const bytesToSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) {
    return '0 Bytes'
  }
  const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)))
  return (bytes / Math.pow(1024, i)).toPrecision(3) + ' ' + sizes[i]
}
