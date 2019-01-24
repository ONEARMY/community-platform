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

export const ListHeader = styled.div`
  width: 100%;
  display: inline-block;
  color: grey;
`

export const PostCount = styled.span`
  display: inline-block;
  width: 55%;
  font-size: 1.1em;
`

export const OrderBy = styled.span`
  font-size: 0.7em;
  width: 10%;
  display: inline-block;
  &:hover {
    cursor: pointer;
  }
`

export const List = styled.ul`
  list-style: none;
  width: 100%;
  display: inline-block;
  background-color: white;
`
