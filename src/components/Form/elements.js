import styled, { css } from 'styled-components'
import Typography from '@material-ui/core/Typography'
import { colors } from 'src/themes/styled.theme'

const inputStyles = css`
  border: 1px solid ${colors.grey};
  font-size: 1.1em;
  background: white;
  width: 100%;
`

export const Input = styled.input`
  ${inputStyles};
  height: 45px;
  padding-left: 5px;
`

export const TextAreaStyled = styled.textarea`
  ${inputStyles};
  height: 150px;
  font-family: inherit;
  text-align: center;
  padding-top: 10px;
`

export const LabelStyled = styled(Typography)`
  color: ${colors.grey3} !important;
  font-size: 1.3em !important;
  margin: 25px 0 !important;
`
