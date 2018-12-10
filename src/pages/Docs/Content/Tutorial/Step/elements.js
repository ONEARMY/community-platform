import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';


export const Container = styled.div `
    text-align: center;
`;

export const StepCard = styled.div `
    min-width: 275px;
    max-width: 900px;
    margin: 20px auto;
    border-radius: 0;
    border: 1px solid #dddddd;
    box-shadow: inherit;
`;

export const StepHeader = styled.div `
    background-color: #ffe495;
    height: 70px;
`;

export const StepIndex = styled(Typography)
`
    padding: 20px;
    font-weight: bold;
`;

export const StepTitle = styled(Typography)
`
    color: black;
    text-transform: uppercase;
    margin-top: 10px;
`;

export const StepDescription = styled(Typography)
`
    margin: 20px 25px 30px !important; 
`;

export const StepImage = styled.img `
    max-width: 600px;
`;