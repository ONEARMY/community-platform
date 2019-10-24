import React from 'react'
import { NavLink } from 'react-router-dom'
import { COMMUNITY_PAGES } from 'src/pages/PageList'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { Box } from 'rebass'
import { Image, ImageProps } from 'rebass'
import Text from 'src/components/Text'
import MenuCurrent from 'src/assets/images/menu-current.svg'
import AccountButtons from '../../Login/AccountButtons'
import ImageTargetBlank from 'src/assets/icons/link-target-blank.svg'
import { LinkTargetBlank } from 'src/components/Links/LinkTargetBlank/LinkTargetBlank'

const PanelContainer = styled(Box)`
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  //   overflow: hidden;
  display: block;
  //   top: 100%;
  z-index: 900;
  height: 100%;
`

const PanelMenu = styled(Box)`
  background-color: #fff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: block !important;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  text-align: center;
  overflow: visible;
  min-width: 200px;
`

const PanelItem = styled(Box)`
  // width: 100%;
  padding: ${theme.space[4]}px 0px;
`

const PanelButton = styled(Box)`
  // width: 100%;
  padding: ${theme.space[1]}px 0px;
`

const MenuLink = styled(NavLink).attrs(({ name }) => ({
  activeClassName: 'current',
}))`
  color: ${'black'};
  font-size: ${theme.fontSizes[2]}px;
  position: relative;
  > div {
    z-index: 1;
    position: relative;
    &:hover {
      opacity: 0.7;
    }
  }
  &.current {
    &:after {
      content: '';
      width: 70px;
      height: 20px;
      display: block;
      position: absolute;
      background-position: 50% 70%;
      background-image: url(${MenuCurrent});
      z-index: 0;
      background-repeat: no-repeat;
      background-size: contain;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

export class MenuMobilePanel extends React.Component {
  render() {
    return (
      <>
        <PanelContainer>
          <PanelMenu>
            {COMMUNITY_PAGES.map(page => (
              <PanelItem>
                <MenuLink to={page.path} data-cy="page-link" key={page.path}>
                  <div>{page.title}</div>
                </MenuLink>
              </PanelItem>
            ))}
            <PanelButton>
              <AccountButtons
                link={'/sign-in'}
                text="Login"
                variant="secondary"
                style={{
                  fontWeight: 'bold',
                  marginRight: 2,
                  display: 'inline-block',
                  width: 100,
                }}
                isMobile={true}
              />
            </PanelButton>
            <PanelButton>
              <AccountButtons
                link={'/sign-up'}
                text="Join"
                variant="colorful"
                isMobile={true}
                style={{ display: 'inline-block', width: 100 }}
              />
            </PanelButton>
            <PanelItem>
              <MenuLink to={'/bazar'} data-cy="page-link">
                <div>Bazar</div>
              </MenuLink>
            </PanelItem>
            <PanelItem>
              <LinkTargetBlank
                target="_blank"
                href={'/bazar'}
                color={'black'}
                mr={1}
                width={1}
              >
                <Text auxiliary width={1}>
                  Global Site
                </Text>
              </LinkTargetBlank>
            </PanelItem>
          </PanelMenu>
        </PanelContainer>
      </>
    )
  }
}

export default MenuMobilePanel
