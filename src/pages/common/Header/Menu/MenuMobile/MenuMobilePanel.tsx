import { Component } from 'react';
import { COMMUNITY_PAGES } from 'src/pages/PageList'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import { Box } from 'rebass'
import Profile from 'src/pages/common/Header/Menu/Profile/Profile'
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink'
import MenuMobileExternalLink from './MenuMobileExternalLink'
import { BAZAR_URL, GLOBAL_SITE_URL } from 'src/utils/urls'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'

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
export const PanelItem = styled(Box)`
  padding: ${theme.space[3]}px 0px;
`

export const MenuMobileLinkContainer = styled(Box)`
  border-top: 1px solid #ababac;
  border-bottom: 1px solid #ababac;
  margin-top: 5px;
`
interface IInjectedProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export class MenuMobilePanel extends Component {
  get injected() {
    return this.props as IInjectedProps
  }

  render() {
    const user = this.injected.userStore.user

    return (
      <>
        <PanelContainer>
          <PanelMenu>
            {COMMUNITY_PAGES.map(page => {
              const link = (
                <MenuMobileLink
                  path={page.path}
                  content={page.title}
                  key={page.path}
                />
              )
              return page.requiredRole
                ? user && user.userRoles?.includes(page.requiredRole)
                  ? link
                  : null
                : link
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
