import styled from 'styled-components'
import { colors } from 'src/themes/styled.theme'

export const Select = styled<any, 'select'>('select')`
  border: 1px solid ${colors.grey};
  color: ${colors.black};
  border-radius: 25px;
  display: inline-block;
  height: 50px;
  vertical-align: middle;
  margin: 0 20px;
`
