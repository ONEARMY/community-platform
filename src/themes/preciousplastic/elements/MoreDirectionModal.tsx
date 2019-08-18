import { css } from 'styled-components'
import WhiteBubble0 from 'src/themes/preciousplastic/assets/images/white-bubble_0.svg'
import WhiteBubble1 from 'src/themes/preciousplastic/assets/images/white-bubble_1.svg'
import WhiteBubble2 from 'src/themes/preciousplastic/assets/images/white-bubble_2.svg'
import WhiteBubble3 from 'src/themes/preciousplastic/assets/images/white-bubble_3.svg'
import breakpoints from '../breakpoints'

const ModalContainer = css`
  position: relative;
  margin-top: 50px;
  padding-top: 90px;
  padding-bottom: 90px;
  &:after {
    content: '';
    background-image: url(${WhiteBubble0});
    width: 100%;
    height: 100%;
    z-index: -1;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: 59%;
    transform: translate(-50%, -50%);
    left: 50%;
    max-width: 850px;
    background-position: center 10%;
  }

  @media only screen and (min-width: ${breakpoints[0]}) {
    &:after {
      background-image: url(${WhiteBubble1});
    }
  }

  @media only screen and (min-width: ${breakpoints[1]}) {
    &:after {
      background-image: url(${WhiteBubble2});
    }
  }

  @media only screen and (min-width: ${breakpoints[2]}) {
    &:after {
      background-image: url(${WhiteBubble3});
    }
  }
`

const ModalText = css`
  text-align: center;
  font-size: 26px;
  max-width: 780px;
  margin: 0 auto;
  padding: 0px 20px;
`

const MoreDirectionModal = {
  container: ModalContainer,
  text: ModalText,
}

export default MoreDirectionModal
