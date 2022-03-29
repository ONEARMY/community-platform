import { Flex, Text } from 'theme-ui'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'
import { Icon } from 'oa-components'

const SiteFooter = () => {
  const theme = useTheme() as any
  const discordButtonWidth = 310

  const Anchor = styled('a')`
    color: #fff;
    text-decoration: underline;
  `

  const FooterContainer = styled(Flex)`
    color: #fff;
    display: flex;
    flex-direction: column;
    margin-top: 45px;
    line-heigh: 1.5;
    padding: 45px ${theme.space[4]}px;
    position: relative;
    text-align: center;

    @media only screen and (min-width: ${theme
        .breakpoints[1]}) and (max-width: ${theme.breakpoints[2]}) {
      align-items: flex-start;
      padding-top: 35px;
      padding-bottom: 35px;
      padding-left: 65px;
      padding-right: ${discordButtonWidth}px;
      text-align: left;
    }

    @media only screen and (min-width: ${theme.breakpoints[2]}) {
      flex-direction: row;
      padding-right: ${discordButtonWidth}px;
      text-align: left;
    }
  `

  const OneArmyIcon = styled(Icon)`
    @media only screen and (min-width: ${theme
        .breakpoints[1]}) and (max-width: ${theme.breakpoints[2]}) {
      position: absolute;
      top: 45px;
      left: 30px;
    }
  `

  return (
    <FooterContainer
      bg="#27272c"
      sx={{alignItems: 'center'}}
      style={{
        marginTop: '45px',
      }}
    >
      <OneArmyIcon glyph={'star-active'} mb={[3, 3, 0]} />
      <Text ml={[0, 0, 0, 3]} mr={1}>
        {theme.name} is a project by{' '}
        <Anchor href="https://onearmy.earth/" target="_blank">
          One Army
        </Anchor>
        .
      </Text>

      <Text mt={[2, 2, 0]}>
        Running on our Platform software,{' '}
        <Anchor href="https://platform.onearmy.earth/" target="_blank">
          help us build it
        </Anchor>
      </Text>
    </FooterContainer>
  )
}

export default SiteFooter
