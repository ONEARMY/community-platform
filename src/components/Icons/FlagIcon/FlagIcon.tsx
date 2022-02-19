import * as React from 'react'
import FlagIconFactory from 'react-flag-icon-css'
import styled from 'styled-components'

// Please only use `FlagIconFactory` one time in your application, there is no
// need to use it multiple times (it would slow down your app). You may place the
// line below in a `FlagIcon.js` file in your 'components' directory, then
// write `export default FlagIcon` as shown below and import it elsewhere in your app.
const FlagIcon = FlagIconFactory(React, { useCssModules: false })

const FlagIconEvents = styled(FlagIcon)`
  border-radius: 5px;
  background-size: cover !important;
  height: 23px;
  width: 35px !important;

  @media only screen and (max-width: ${props => props.theme.breakpoints[1]}) {
    height: 15px;
    width: 25px !important;
  }
`

const FlagIconHowTos = styled(FlagIcon)`
  border-radius: 3px;
  background-size: cover !important;
  height: 14px;
  width: 21px !important;
`
// If you are not using css modules, write the following:
// const FlagIcon = FlagIconFactory(React, { useCssModules: false })

export { FlagIconHowTos }
export default FlagIconEvents
