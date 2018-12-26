import styled from 'styled-components'

import LinearProgress from '@material-ui/core/LinearProgress'

const getColor = ({
    progress
}) => {

    if (progress === 100) {
        return `
            background-color: green;
        `;
    };
};

export const Container = styled.div `
    text-align: center;
    margin: 2em auto;
`;

export const ProgressContainer = styled.div `
    margin-top: 10px;
`;

export const ProgressBar = styled(LinearProgress)
`
> div {
    ${props => getColor(props)};
}
`;