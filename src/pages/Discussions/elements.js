import styled from 'styled-components'

import Row from 'src/components/Layout/Row.js'

export const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: black;
`

export const Main = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const List = styled.ul`
  list-style: none;
  width: 100%;
  display: inline-block;
  padding: 0;
`
