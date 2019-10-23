import React from 'react'
import { NavLink } from 'react-router-dom'
import { COMMUNITY_PAGES } from 'src/pages/PageList'
import theme from 'src/themes/styled.theme'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { Box } from 'rebass'
import MenuCurrent from 'src/assets/images/menu-current.svg'
import { Link } from 'src/components/Links'
import Modal from '@material-ui/core/Modal'
import { auth } from 'src/utils/firebase'
import { Button } from 'src/components/Button'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'
import { LoginForm } from './Login.form'
import { SignUpForm } from './SignUp.form'
import { ResetPWForm } from './ResetPW.form'
import { display, DisplayProps } from 'styled-system'

const ButtonSign = styled(Button)<DisplayProps>`
  ${display}
`
interface IProps {
  link: string
  text: string
  variant: string
  style?: object
}

export class AccountButtons extends React.Component<IProps> {
  render() {
    return (
      <>
        <Link to={this.props.link}>
          <ButtonSign
            variant={this.props.variant}
            display={['none', 'none', 'flex']}
            small
            data-cy={this.props.text.toLowerCase()}
            style={this.props.style}
          >
            {this.props.text}
          </ButtonSign>
        </Link>
      </>
    )
  }
}

export default AccountButtons
