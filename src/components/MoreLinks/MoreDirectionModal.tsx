import React from 'react'
import { Flex, Box, Text, Button } from 'rebass'
import styled from 'styled-components'
import theme from 'src/themes/styled.preciousplastic'

const MoreModalContainer = styled(Box)`
  ${theme.elements.moreDirectionModal.container}
`

const MoreText = styled(Text)`
  ${theme.elements.moreDirectionModal.text}
`

interface IProps {
  text: string
  buttonVariant: string
  buttonLabel: string
}

export class MoreModal extends React.Component<IProps> {
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

export default MoreModal
