import { Link as ExternalLink } from 'theme-ui'
import { Button } from 'oa-components'

export const DiscordLink = () => {
  return (
    <ExternalLink
      target="_blank"
      href="https://discordapp.com/invite/cGZ5hKP"
      data-cy="feedback"
    >
      <Button variant="primary">
        Join our chat{' '}
        <span role="img" aria-label="talk-bubble">
          💬
        </span>
      </Button>
    </ExternalLink>
  )
}

export default DiscordLink
