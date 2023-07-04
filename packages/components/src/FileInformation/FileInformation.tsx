import * as React from 'react'
import type { availableGlyphs } from '../'
import { Flex, Text } from 'theme-ui'
import { ExternalLink, Icon } from '../'
import { useHistory } from 'react-router-dom'
import { Tooltip } from 'oa-components'

export interface IProps {
  file: {
    name: string
    size: number
    downloadUrl?: string | undefined
  }
  allowDownload?: boolean
  handleClick?: () => Promise<void>
  redirectToSignIn?: boolean
}

const FileDetails = (props: {
  file: {
    name: string
  }
  glyph: availableGlyphs
  size: string
  redirectToSignIn: boolean
}) => {
  const { file, glyph, size, redirectToSignIn } = props
  const history = useHistory()

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
        onClick={() =>
          redirectToSignIn ? history.push('/sign-in') : undefined
        }
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

export const FileInformation = ({
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
          <FileDetails
            file={file}
            glyph="download-cloud"
            size={size}
            redirectToSignIn={false}
          />
        </ExternalLink>
      ) : (
        <FileDetails
          file={file}
          glyph="download-cloud"
          size={size}
          redirectToSignIn={redirectToSignIn || false}
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
