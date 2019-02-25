import styled from 'styled-components'
import { colors } from 'src/themes/styled.theme'
import DialogTitle from '@material-ui/core/DialogTitle'
import { DialogActions } from '@material-ui/core'
import { Button } from 'src/components/Button'

// @TODO : these are are duplicated from HowTo/Step/elements :

export const DialogText = styled(DialogTitle)`
  width: 600px;
  border-radius: 0 !important;
`

export const DialogButtons = styled(DialogActions)`
  padding: 10px;
  justify-content: center !important;
`

export const CancelButton = styled(Button)`
  width: 112px;
  height: 60px;
`
export const ConfirmButton = styled(Button)`
  background-color: ${props => (props.disabled ? colors.grey : colors.blue)};
  width: 112px;
  height: 60px;
`
