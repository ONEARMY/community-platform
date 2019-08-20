import React from 'react'
import { Flex, Box, Text, Button } from 'rebass'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import WhiteBubble0 from 'src/assets/images/white-bubble_0.svg'
import WhiteBubble1 from 'src/assets/images/white-bubble_1.svg'
import WhiteBubble2 from 'src/assets/images/white-bubble_2.svg'
import WhiteBubble3 from 'src/assets/images/white-bubble_3.svg'

const MoreModalContainer = styled(Box)`
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
  @media only screen and (min-width: ${theme.breakpoints[0]}) {
    &:after {
      background-image: url(${WhiteBubble1});
    }
  }
  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    &:after {
      background-image: url(${WhiteBubble2});
    }
  }

  @media only screen and (min-width: ${theme.breakpoints[2]}) {
    &:after {
      background-image: url(${WhiteBubble3});
    }
  }
`

const MoreText = styled(Text)`
  text-align: center;
  font-size: 26px;
  max-width: 780px;
  margin: 0 auto;
  padding: 0px 20px;
`

interface IProps {
  text: string
  buttonVariant: string
  buttonLabel: string
}

export class MoreContainer extends React.Component<IProps> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <>
        <MoreModalContainer>
          <MoreText>{this.props.text}</MoreText>
          <Flex justifyContent={'center'} mt={5}>
            <Button variant={this.props.buttonVariant}>
              {this.props.buttonLabel}
            </Button>
          </Flex>
        </MoreModalContainer>
      </>
    )
  }
}

export default MoreContainer
