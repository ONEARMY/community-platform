import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import colors from 'src/themes/colors'

export const Input = styled.input `
    border: 1px solid ${colors.grey};
    font-size: 1.1em;
    background: white;
    width: 100%;
    height: 45px;
    &::placeholder {
        padding-left: 5px;
    }
`;

export const LabelStyled = styled(Typography)
`
    color: ${colors.grey3} !important;
    font-size: 1.3em !important;
    margin: 25px 0 !important;
`;