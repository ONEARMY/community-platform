import React from 'react'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'
import Profile from 'src/pages/common/Header/Profile/Profile'
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop'
import MenuMobile from 'src/pages/common/Header/Menu/MenuMobile'
import MenuMobilePanel from 'src/pages/common/Header/Menu/MenuMobilePanel'
import posed, { PoseGroup } from 'react-pose'
import Logo from 'src/pages/common/Header/Menu/Logo/Logo'
import theme from 'src/themes/styled.theme'

interface IState {
  showMobilePanel: boolean
}

const MobileMenuWrapper = styled(Flex)`
  position: relative;

  @media only screen and (max-width: ${theme.breakpoints[1]}) {
    display: flex;
  }

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    display: none;
  }
`
const DesktopMenuWrapper = styled(Flex)`
  position: relative;

  @media only screen and (max-width: ${theme.breakpoints[1]}) {
    display: none;
  }

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    display: flex;
  }
`

export class Header extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      showMobilePanel: false,
    }
  }

  toggleMobilePanel() {
    this.setState({ showMobilePanel: !this.state.showMobilePanel })
  }

  render() {
    const top = this.state.showMobilePanel ? '0' : '-100%'

    const AnimationContainer = posed.div({
      // use flip pose to prevent default spring action on list item removed
      flip: {
        transition: {
          // type: 'tween',
          // ease: 'linear',
        },
      },
      // use a pre-enter pose as otherwise default will be the exit state and so will animate
      // horizontally as well

      enter: {
        duration: 200,
        position: 'relative',
        top: '0',
      },
      exit: {
        position: 'relative',
        top: '-100%',
        duration: 200,
      },
    })

    return (
      <>
        <Flex
          data-cy="header"
          bg="white"
          justifyContent="space-between"
          alignItems="center"
          sx={{ zIndex: 1000, position: 'relative' }}
        >
          <Flex>
            <Logo />
          </Flex>
          <DesktopMenuWrapper className="menu-desktop" px={2}>
            <MenuDesktop />
            <Profile />
          </DesktopMenuWrapper>
          <MobileMenuWrapper className="menu-mobile">
            <Flex
              alignItems={'center'}
              onClick={() => {
                this.toggleMobilePanel()
                console.log('hi', this.state.showMobilePanel)
              }}
            >
              <div>MOBILE</div>
            </Flex>
          </MobileMenuWrapper>
        </Flex>
        <PoseGroup>
          {this.state.showMobilePanel && (
            <AnimationContainer key={'mobilePanelContainer'}>
              <MobileMenuWrapper>
                {console.log('hi', this.state.showMobilePanel)}
                <MenuMobilePanel />
              </MobileMenuWrapper>
            </AnimationContainer>
          )}
        </PoseGroup>
      </>
    )
  }
}

export default Header
