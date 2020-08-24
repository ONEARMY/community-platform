import React from 'react'
import { Flex, Image } from 'rebass/styled-components'
import styled, { keyframes } from 'styled-components'

import PPLogo from 'src/assets/images/precious-plastic-logo-official.svg'
import Text from 'src/components/Text'

interface IProps {
  isMobile?: boolean
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const RotatingLogo = styled(Image)`
  animation: ${rotate} 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  padding: 1rem;
`

export class Loader extends React.Component<IProps> {
  // eslint-disable-next-line
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <>
        <Flex flexWrap="wrap" justifyContent="center">
          <RotatingLogo src={PPLogo} width={[75, 75, 100]} />
          <Text txtcenter width={1}>
            loading...
          </Text>
        </Flex>
      </>
    )
  }
}

export default Loader
