import React from 'react'
import { NavLink } from 'react-router-dom'
import { COMMUNITY_PAGES } from 'src/pages/PageList'
import theme from 'src/themes/styled.theme'
import { Flex } from 'rebass'
import styled from 'styled-components'
import { display, DisplayProps } from 'styled-system'

const FlexMobileWrapper = styled(Flex)<DisplayProps>`
  ${display}
`

export class MenuMobile extends React.Component {
  render() {
    return (
      <>
        <FlexMobileWrapper
          alignItems={'center'}
          px={2}
          display={['flex', 'flex', 'none']}
        >
          <div>MOBILE</div>
        </FlexMobileWrapper>
      </>
    )
  }
}

export default MenuMobile
