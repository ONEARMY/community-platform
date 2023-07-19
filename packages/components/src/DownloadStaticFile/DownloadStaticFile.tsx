import * as React from 'react'
import type { availableGlyphs } from '..'
import { Flex, Text } from 'theme-ui'
import { ExternalLink, Icon, Tooltip } from '..'

export interface IProps {
  file: {
    name: string
    size: number
    downloadUrl?: string | undefined
  }
  allowDownload?: boolean
  handleClick?: () => Promise<void>
  redirectToSignIn?: () => Promise<void>
}

const FileDetails = (props: {
  file: {
    name: string
  }
  glyph: availableGlyphs
  size: string
  redirectToSignIn?: () => Promise<void>
}) => {
  const { file, glyph, size, redirectToSignIn } = props

  return (
    <>
      <Flex
        p={2}
        mb={1}
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
        }}
        onClick={() => redirectToSignIn && redirectToSignIn()}
        data-tip={redirectToSignIn ? 'Login to download' : ''}
      >
        <Icon size={24} glyph={glyph} mr={3} />
        <Text
          sx={{
            flex: 1,
            fontSize: 1,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
          mr={3}
        >
          {file.name}
        </Text>
        <Text sx={{ fontSize: 1 }}>{size}</Text>
      </Flex>
      <Tooltip />
    </>
  )
}

export const DownloadStaticFile = ({
  file,
  allowDownload,
  handleClick,
  redirectToSignIn,
}: IProps) => {
  const size = bytesToSize(file.size || 0)

  if (!file) {
    return null
  }

  return (
    <>
      {allowDownload && file.downloadUrl && !redirectToSignIn ? (
        <ExternalLink
          m={1}
          onClick={() => handleClick && handleClick()}
          href={file.downloadUrl}
          download={file.name}
          style={{ width: '300px', marginLeft: 0 }}
        >
          <FileDetails file={file} glyph="download-cloud" size={size} />
        </ExternalLink>
      ) : (
        <FileDetails
          file={file}
          glyph="download-cloud"
          size={size}
          redirectToSignIn={redirectToSignIn}
        />
      )}
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
