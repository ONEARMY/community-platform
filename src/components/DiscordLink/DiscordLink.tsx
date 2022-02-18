import { Link } from 'rebass/styled-components'
import { Button } from 'oa-components'
import styled, { useTheme } from 'styled-components'

export const DiscordLink = () => {
  return (
    <Link
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
    </Link>
  )
}

export default DiscordLink
