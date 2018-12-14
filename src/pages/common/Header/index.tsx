import * as React from 'react'

import logo from '../../../assets/images/logo.png'
import { Container, Img } from './elements'

const Header: React.StatelessComponent<{}> = () => {
  return (
    <Container>
      <Img src={logo} alt="logo" />
    </Container>
  )
}

export default Header
