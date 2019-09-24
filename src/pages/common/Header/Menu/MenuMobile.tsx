import React from 'react'
import { NavLink } from 'react-router-dom'
import { COMMUNITY_PAGES } from 'src/pages/PageList'
import theme from 'src/themes/styled.theme'
import { Flex } from 'rebass'

export class MenuMobile extends React.Component {
  render() {
    return (
      <>
        <Flex alignItems={'center'} sx={{ display: ['flex', 'flex', 'none'] }}>
          <div>MOBILE</div>
        </Flex>
      </>
    )
  }
}

export default MenuMobile
