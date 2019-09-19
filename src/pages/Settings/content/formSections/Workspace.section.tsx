import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box, Image } from 'rebass'
import styled from 'styled-components'

interface IProps {}
interface IState {
  checkedFocusValue?: string
}

const ImgOp = styled(Image)`
  opacity: 0.5;
`

export class WorkspaceSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Flex
        card
        mediumRadius
        bg={'white'}
        mt={5}
        flexWrap="wrap"
        flexDirection="column"
      >
        <Heading small p={4}>
          Workspace
        </Heading>
      </Flex>
    )
  }
}
