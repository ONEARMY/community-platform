import { Flex, Text } from 'theme-ui'
import { ExternalLink } from '../ExternalLink/ExternalLink'
import { Icon } from '../Icon/Icon'

export interface DownloadFilesProps {
  link: string
  handleClick?: () => Promise<void>
}

export const DownloadFiles = (props: DownloadFilesProps) => {
  return (
    <ExternalLink
      href={props.link}
      onClick={() => props.handleClick && props.handleClick()}
    >
      <Flex
        p={2}
        mb={1}
        sx={{
          background: 'yellow.base',
          border: '2px solid black',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          maxWidth: '300px',
          borderRadius: 1,
        }}
      >
        <Icon size={24} glyph={'external-url'} mr={3} />
        <Text sx={{ flex: 1, fontSize: 1, color: 'black' }} mr={3}>
          Download files
        </Text>
      </Flex>
    </ExternalLink>
  )
}
