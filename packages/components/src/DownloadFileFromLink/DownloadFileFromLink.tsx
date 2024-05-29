import { DownloadButton } from '../DownloadButton/DownloadButton'
import { ExternalLink } from '../ExternalLink/ExternalLink'

export interface DownloadFileFromLinkProps {
  link: string
  handleClick?: () => Promise<void>
  redirectToSignIn?: () => Promise<void>
}

export const DownloadFileFromLink = (props: DownloadFileFromLinkProps) => {
  return (
    <>
      {!props.redirectToSignIn ? (
        <ExternalLink
          href={props.link}
          onClick={() => props.handleClick && props.handleClick()}
        >
          <DownloadButton isLoggedIn />
        </ExternalLink>
      ) : (
        <DownloadButton
          onClick={() => props.handleClick && props.handleClick()}
          isLoggedIn={false}
        />
      )}
    </>
  )
}
