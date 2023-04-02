import { Component } from 'react'
import { getAvailablePageList } from 'src/pages/PageList'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import styled from '@emotion/styled'
import { Box } from 'theme-ui'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { getSupportedModules } from 'src/modules'
import { inject } from 'mobx-react'
import type { ThemeStore } from 'src/stores/Theme/theme.store'

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
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`
export const PanelItem = styled(Box as any)`
  padding: ${theme.space[3]}px 0px;
`

@inject('themeStore')
export class MenuMobilePanel extends Component {
  injected() {
    return this.props as {
      themeStore: ThemeStore
    }
  }

  render() {
    return (
      <>
        <PanelContainer>
          <PanelMenu>
            {getAvailablePageList(getSupportedModules()).map((page) => {
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
          </PanelMenu>
        </PanelContainer>
      </>
    )
  }
}

export default MenuMobilePanel
