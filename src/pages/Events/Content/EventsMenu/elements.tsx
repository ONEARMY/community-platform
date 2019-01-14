import { withStyles } from '@material-ui/core'
import Select from '@material-ui/core/Select'
import styled from 'styled-components'

const StyledSelect = styled(Select)`
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
  border-radius: 3px;
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
`

const styledButton = withStyles({
  root: {},
})
