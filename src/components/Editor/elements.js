import styled, { css } from 'styled-components'

import Row from 'src/components/Layout/Row.js'

export const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: black;
  /* background-color: white; */
`

export const Main = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`
