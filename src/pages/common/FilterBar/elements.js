import styled from 'styled-components'
import Link from 'react-router-dom/Link'
import { Button } from 'src/components/Button'

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

export const LinkToCreate = styled(Link)`
  float: right;
  margin: 30px;
`
export const CreateBtn = styled(Button)`
  display: flex;
  /* TODO : custom style */
`
