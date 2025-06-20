import { Flex, Text } from 'theme-ui'

import { DownloadCounter } from '../DownloadCounter/DownloadCounter'
import { Icon } from '../Icon/Icon'
import { Tooltip } from '../Tooltip/Tooltip'

import type { IGlyphs } from '../Icon/types'

export interface IProps {
  onClick: () => void
  fileDownloadCount?: number
  isLoggedIn?: boolean
  label?: string
  glyph?: keyof IGlyphs
}

export const DownloadButton = (props: IProps) => {
  const { fileDownloadCount, glyph, isLoggedIn, label, onClick } = props
  return (
    <>
      <Flex
        sx={{
          padding: 2,
          background: 'accent.base',
          border: '2px solid black',
          flexDirection: 'row',
          maxWidth: '300px',
          borderRadius: 1,
          cursor: 'pointer',
          gap: 2,
        }}
        onClick={onClick}
        data-cy="downloadButton"
        data-testid="downloadButton"
        data-tooltip-id="download-files"
        data-tooltip-content={!isLoggedIn ? 'Login to download' : ''}
      >
        <Icon size={24} glyph={glyph || 'external-url'} />
        <Text
          sx={{
            flex: 1,
            fontSize: 1,
            color: 'black',
            overflowWrap: 'break-word',
            alignSelf: label ? 'flex-start' : 'center',
          }}
        >
          {label ? label : 'Download files'}
        </Text>
      </Flex>
      <Tooltip id="download-files" />

      <DownloadCounter total={fileDownloadCount} />
    </>
  )
}
