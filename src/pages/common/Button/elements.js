import styled, {
    css
} from 'styled-components';
import Link from 'react-router-dom/Link';
import {
    MdFileDownload,
    MdAdd
} from 'react-icons/md'

import colors from 'src/themes/colors'

const styles = css `
    width: ${props => props.width};
    display: block;
    height: ${props => props.height};
    text-transform: uppercase;
    text-align: center;
    background-color: ${colors.blue};
    border: none;
    text-decoration: none;
    cursor: pointer;
    font-size: 0.8em;
    color: black;
`;

export const LinkButton = styled(Link)
`
  ${styles};
`;
export const AButton = styled.a `
  ${styles};
`;
export const Button = styled.button `
  ${styles};
`;
export const DownloadButton = styled.a `
  ${styles};
`;
export const InnerButtonText = styled.span `
  margin-left: 5px;
  margin-top: 5px;
`;
export const Container = styled.div `
    display: inline-flex;
    flex-direction: row;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
`;
export const DownloadIcon = styled(MdFileDownload)
`
    width: 25px;
    height: 25px;
    color: black;
`;
export const AddIcon = styled(MdAdd)
`
    width: 25px;
    height: 25px;
    color: black;
`;