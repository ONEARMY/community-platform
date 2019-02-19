import styled from 'styled-components'
import { colors } from 'src/themes/styled.theme'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import { MdDelete } from 'react-icons/md'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import { Button } from 'src/components/Button'

export const StepHeader = styled.div`
  background-color: ${colors.yellow};
  height: 70px;
`

export const StepTitle = styled(Typography)`
  padding: 20px !important;
  font-weight: bold !important;
  color: black;
`

export const Label = styled(Typography)`
  font-size: 1.3em !important;
  margin: 10px 0 !important;
`

export const Container = styled.div`
  text-align: center;
  margin-top: 80px;
`

export const StepCard = styled(Card)`
  box-shadow: inherit !important;
  border: 1px solid ${colors.grey};
  border-radius: 0 !important;
  margin-top: 1em;
  width: 100%;
`

export const DeleteStepBtn = styled.div`
  cursor: pointer;
  height: 50px;
  width: 100%;
  border-top: 1px solid #dddddd;
`

export const DeleteText = styled.span`
  text-transform: uppercase;
  font-size: 0.8em;
  line-height: 50px;
  color: ${colors.grey2};
  margin-left: 10px;
  ${DeleteStepBtn}:hover & {
    color: black;
  }
`

export const DeleteIcon = styled(MdDelete)`
  color: ${colors.grey2};
  vertical-align: text-top;
  width: 18px;
  display: inline-block;
  height: 19px;
  ${DeleteStepBtn}:hover & {
    color: black;
  }
`

export const StepImage = styled.img`
  width: 300px;
  display: block;
  margin: 10px auto;
`

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
  background-color: ${colors.blue};
  width: 112px;
  height: 60px;
`
