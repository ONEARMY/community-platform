import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress'

const getColor = ({ progress }) => {
  if (progress === 100) {
    return `
            background-color: green;
        `
  }
}

export const ProgressBar = styled(LinearProgress)<any>`
  > div {
    ${props => getColor(props)};
  }
`
