import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment'
import {
    Field
} from 'react-final-form'

import colors from 'src/themes/colors'

export const FormContainer = styled.div `
    position: relative;
    margin: 0 auto;
`;

export const Title = styled(Typography)
`
    display: table !important;
    margin: 30px auto !important;
`;

export const TutorialForm = styled.form `
    width: 100%;
    margin: 0 auto;
    text-align: left;
`;

export const Background = styled.div `
    max-width: 1200px;
    width: 75%;
    display: block;
    background-color: #ededed;
    position: relative;
    padding: 40px 50px;
    margin: auto;
`;

export const DescriptionContainer = styled.div `
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    display: block;
    margin: auto 0;
    max-width: 500px;
`;

export const StepBackground = styled.div `
    margin: 40px auto;
    max-width: 600px;
`;

export const Label = styled(Typography)
`
    color: ${colors.grey3} !important;
    font-size: 1.3em !important;
    margin: 25px 0 !important;
`;

export const TextArea = styled.textarea `
    width: 100%;
    background: white;
    height: 150px;
    font-size: 1.1em;
    border: 1px solid ${colors.grey};
    &::placeholder {
        text-align: center;
        padding-top: 10px;
    }
`;

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

export const CoverImage = styled.img `
    width: 300px;
    display: block;
    margin: 20px auto;
`;

export const Select = styled(Field)
`
    border: 1px solid ${colors.grey};
    margin: 0 auto;
    display: block;
    font-size: 1.1em;
    background: white;
    width: 40%;
    height: 45px;
`;