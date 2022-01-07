import { Link, Button } from 'rebass/styled-components'
import styled, { useTheme } from 'styled-components'

export const DiscordLink = () => {
  const theme = useTheme() as any
  const OptionalText = styled(`span`)`
    display: inline-block;
    margin-right: ${theme.space[1]}px;
    @media screen and (max-width: ${theme.breakpoints[1]}) {
      display: none;
    }
  `
  return (
    <Link
      target="_blank"
      href="https://discordapp.com/invite/cGZ5hKP"
      data-cy="feedback"
    >
      <Button variant="primary">
        <OptionalText>#Feedback?</OptionalText>
        Join our chat{' '}
        <span role="img" aria-label="talk-bubble">
          💬
        </span>
      </Button>
    </Link>
  )
}

export default DiscordLink
