import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100px;
  background-color: white;
  display: inline-block;
  &:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
`
