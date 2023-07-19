import { Flex, Text } from 'theme-ui'
import { ExternalLink } from '../ExternalLink/ExternalLink'
import { Icon } from '../Icon/Icon'
import { Tooltip } from '..'

export interface DownloadFileFromLinkProps {
  link: string
  handleClick?: () => Promise<void>
  redirectToSignIn?: () => Promise<void>
}

const DownloadButton = (props: { redirectToSignIn?: () => Promise<void> }) => {
  return (
    <>
      <Flex
        p={2}
        mb={1}
        sx={{
          background: 'accent.base',
          border: '2px solid black',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          maxWidth: '300px',
          borderRadius: 1,
        }}
        onClick={() => props.redirectToSignIn && props.redirectToSignIn()}
        data-tip={props.redirectToSignIn ? 'Login to download' : ''}
      >
        <Icon size={24} glyph={'external-url'} mr={3} />
        <Text sx={{ flex: 1, fontSize: 1, color: 'black' }} mr={3}>
          Download files
        </Text>
      </Flex>
      <Tooltip />
    </>
  )
}

export const DownloadFileFromLink = (props: DownloadFileFromLinkProps) => {
  return (
    <>
      {!props.redirectToSignIn ? (
        <ExternalLink
          href={props.link}
          onClick={() => props.handleClick && props.handleClick()}
        >
          <DownloadButton />
        </ExternalLink>
      ) : (
        <DownloadButton redirectToSignIn={props.redirectToSignIn} />
      )}
    </>
  )
}
