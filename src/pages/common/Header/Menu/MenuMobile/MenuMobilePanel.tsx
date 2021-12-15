import { Component } from 'react'
import { getAvailablePageList } from 'src/pages/PageList'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import { Box } from 'rebass'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink'
import MenuMobileExternalLink from './MenuMobileExternalLink'
import { BAZAR_URL, GLOBAL_SITE_URL } from 'src/utils/urls'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { getSupportedModules } from 'src/modules'

const PanelContainer = styled(Box)`
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  display: block;
  z-index: ${theme.zIndex.header};
  height: 100%;
`

const PanelMenu = styled(Box)`
  background-color: ${theme.colors.white};
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
export const PanelItem = styled(Box as any)`
  padding: ${theme.space[3]}px 0px;
`

export const MenuMobileLinkContainer = styled(Box as any)`
  border-top: 1px solid ${theme.colors.lightgrey};
  border-bottom: 1px solid ${theme.colors.lightgrey};
  margin-top: 5px;
`

export class MenuMobilePanel extends Component {
  render() {
    return (
      <>
        <PanelContainer>
          <PanelMenu>
            {getAvailablePageList(getSupportedModules()).map(page => {
              const link = (
                <MenuMobileLink
                  path={page.path}
                  content={page.title}
                  key={page.path}
                />
              )
              return page.requiredRole ? (
                <AuthWrapper roleRequired={page.requiredRole} key={page.path}>
                  {link}
                </AuthWrapper>
              ) : (
                link
              )
            })}
            <Profile isMobile={true} />
            <MenuMobileLinkContainer>
              <MenuMobileExternalLink content={'Bazar'} href={BAZAR_URL} />
              <MenuMobileExternalLink
                content={'Global Site'}
                href={GLOBAL_SITE_URL}
              />
            </MenuMobileLinkContainer>
          </PanelMenu>
        </PanelContainer>
      </>
    )
  }
}

export default MenuMobilePanel
