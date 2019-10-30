import * as React from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList'
import { NavLink } from 'react-router-dom'
import Flex from 'src/components/Flex'
import theme from 'src/themes/styled.theme'

interface IProps {
  username: string
}

interface IProps {}

interface IInjectedProps extends IProps {
  userStore: UserStore
}

const ModalContainer = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  right: 10px;
  top: 60px;
  z-index: 900;
  height: 100%;
`
const ModalContent = styled(Box)`
  z-index: 900;
  position: relative;
  background: white;
  border: 2px solid black;
  border-radius: 5px;
`

const ModalLink = styled(NavLink).attrs(({ name }) => ({
  activeClassName: 'current',
}))`
  z-index: 900;
  display: flex;
  flex-direction: column;
  color: #000;
  padding: 10px 30px 10px 30px;
  text-align: left;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  &:focus div {
    color: ${theme.colors.blue};
  }
  &:hover {
    background-color: ${theme.colors.background};
  }
  &:active div {
    color: ${theme.colors.blue};
  }
  &.current {
    background-color: #fff;
    color: ${theme.colors.blue};
  }
`
@inject('userStore')
@observer
export class ProfileModal extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  get injected() {
    return this.props as IInjectedProps
  }

  logout() {
    this.injected.userStore.logout()
  }

  render() {
    const { username } = this.props
    return (
      <ModalContainer data-cy="user-menu-list">
        <ModalContent>
          <Flex>
            <ModalLink to={'/u/' + username} data-cy="menu-item">
              <Flex>Profile</Flex>
            </ModalLink>
          </Flex>
          <Flex>
            {COMMUNITY_PAGES_PROFILE.map(page => (
              <ModalLink key={page.path} to={page.path} data-cy="menu-item">
                <Flex>{page.title}</Flex>
              </ModalLink>
            ))}
          </Flex>
          <Flex>
            <ModalLink onClick={() => this.logout()} to={'/how-to'} data-cy="menu-item">
              <Flex color="rgba(27,27,27,0.5)">Log out</Flex>
            </ModalLink>
          </Flex>
        </ModalContent>
      </ModalContainer>
    )
  }
}
