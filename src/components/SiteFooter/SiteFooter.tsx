import { Flex, Link, Text } from 'rebass/styled-components'
import styled, { useTheme } from 'styled-components'
import { Icon } from 'src/components/Icons'

const SiteFooter = () => {
  const theme = useTheme() as any
  const discordButtonWidth = 310

  const Anchor = styled('a')`
    color: #fff;
    text-decoration: underline;
  `

  const IconGlyph = styled(Icon)`
    transform: translateY(2px);
  `

  const FooterContainer = styled(Flex)`
    color: #fff;
    margin-top: 45px;
    padding: 45px ${theme.space[4]}px;
    display: flex;
    flex-direction: column;
    text-align: center;
    line-heigh: 1.5;

    @media only screen and (min-width: ${theme.breakpoints[1]}) {
      flex-direction: row;
      padding-right: ${discordButtonWidth}px;
      text-align: left;
    }
  `

  return (
    <FooterContainer
      bg="#27272c"
      alignItems="center"
      style={{
        marginTop: '45px',
      }}
    >
      <Icon glyph={'star-active'} mb={[3, 3, 0]} />
      <Text ml={3} mr={1}>
        {theme.name} is a project by{' '}
        <Anchor href="https://platform.onearmy.earth/" target="_blank">
          One Army
        </Anchor>
        .
      </Text>

      <Text mt={[2, 2, 0]}>
        Running on our Platform software,{' '}
        <Anchor
          href="https://github.com/onearmy/community-platform/"
          target="_blank"
        >
          help us build it
          <IconGlyph glyph={'github'} ml={1} />
        </Anchor>
      </Text>
    </FooterContainer>
  )
}

export default SiteFooter
