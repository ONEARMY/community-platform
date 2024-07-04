import * as React from 'react'
import { ReactCountryFlag } from 'react-country-flag'
import styled from '@emotion/styled'
import { Box } from 'theme-ui'

export const FlagIconEvents = styled(ReactCountryFlag)`
  border-radius: 5px;
  background-size: cover !important;
  height: 23px;
  width: 35px !important;
`

export const FlagIconHowTos = styled(ReactCountryFlag)`
  border-radius: 3px;
  background-size: cover !important;
  height: 14px;
  width: 21px !important;
`

export const FlagIcon = (props: any) => (
  <Box {...(props as any)}>
    <FlagIconEvents countryCode={props.code} title={props.code} svg={true}>
      {props.children}
    </FlagIconEvents>
  </Box>
)
