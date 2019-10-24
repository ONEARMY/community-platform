import { Link as ExternalLink, Button } from 'rebass'
import styled from 'styled-components'
import ImageTargetBlank from 'src/assets/icons/link-target-blank.svg'

export const LinkTargetBlank = styled(ExternalLink)`
  padding-right: 30px;
  position: relative;
  &:after {
    content: '';
    background-image: url(${ImageTargetBlank});
    width: 20px;
    height: 20px;
    z-index: 0;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: -5px;
    right: 0px;
  }
`
