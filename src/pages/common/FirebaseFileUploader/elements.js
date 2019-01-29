import styled from 'styled-components'

import LinearProgress from '@material-ui/core/LinearProgress'
import colors from 'src/themes/colors'
import { Button } from 'src/components/Button'

const getColor = ({ progress }) => {
  if (progress === 100) {
    return `
            background-color: green;
        `
  }
}

export const Container = styled.div`
  text-align: center;
  margin: 2em auto;
`

export const ProgressContainer = styled.div`
  margin-top: 10px;
`

export const ProgressBar = styled(LinearProgress)`
  > div {
    ${props => getColor(props)};
  }
`

export const UploadBtn = styled(Button)`
  background-color: ${colors.blue};
  margin: 0 auto;
`
