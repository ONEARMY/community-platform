import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'

export const Container = styled.div`
  width: 10%;
  position: fixed;
  display: inline-block;
  right: 0;
  margin: 30px 0;
  max-height: 360px;
  background-color: white;
  overflow: scroll;
  border-radius: 2%;
`
export const SummaryListItem = styled(Typography)`
  text-transform: capitalize;
`
