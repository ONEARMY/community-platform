import React from 'react'
import { COMMUNITY_PAGES } from 'src/pages/PageList'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import { Box } from 'rebass'
import { LinkTargetBlank } from 'src/components/Links/LinkTargetBlank/LinkTargetBlank'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import MenuMobileLinkItem from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLinkItem'

const PanelContainer = styled(Box)`
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  display: block;
  z-index: 900;
  height: 100%;
`

const PanelMenu = styled(Box)`
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  display: block !important;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  overflow: visible;
  min-width: 200px;
`
const PanelItem = styled(Box)`
  padding: ${theme.space[3]}px 0px;
`

const LinkTargetContainer = styled(Box)`
  border-top: 1px solid #ababac;
  border-bottom: 1px solid #ababac;
  margin-top: 5px;
`
export class MenuMobilePanel extends React.Component {
  render() {
    return (
      <>
        <PanelContainer>
          <PanelMenu>
            {COMMUNITY_PAGES.map(page => (
              <MenuMobileLinkItem
                path={page.path}
                content={page.title}
                key={page.path}
              />
            ))}
            <Profile isMobile={true} />
            <LinkTargetContainer>
              <PanelItem>
                <LinkTargetBlank
                  target="_blank"
                  href={'/bazar'}
                  style={{
                    color: theme.colors.silver,
                    fontSize: theme.fontSizes[2],
                  }}
                >
                  Bazar
                </LinkTargetBlank>
              </PanelItem>
              <PanelItem>
                <LinkTargetBlank
                  target="_blank"
                  href={'/global-site'}
                  style={{
                    color: theme.colors.silver,
                    fontSize: theme.fontSizes[2],
                  }}
                >
                  Global Site
                </LinkTargetBlank>
              </PanelItem>
            </LinkTargetContainer>
          </PanelMenu>
        </PanelContainer>
      </>
    )
  }
}

export default MenuMobilePanel
