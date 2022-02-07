import { Component } from 'react'
import { Flex, Image } from 'rebass/styled-components'
import styled, { keyframes } from 'styled-components'

import Text from 'src/components/Text'
import { inject, observer } from 'mobx-react'
import type { ThemeStore } from 'src/stores/Theme/theme.store'

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

@inject('themeStore')
@observer
export class Loader extends Component<IProps> {
  // eslint-disable-next-line
  constructor(props: any) {
    super(props)
  }

  get injected() {
    return this.props as {
      themeStore: ThemeStore,
    }
  }

  render() {
    const logo = this.injected.themeStore.currentTheme.logo || null
    return (
      <>
        <Flex flexWrap="wrap" justifyContent="center">
          {logo && <RotatingLogo src={logo} width={[75, 75, 100]} />}
          <Text txtcenter width={1}>
            loading...
          </Text>
        </Flex>
      </>
    )
  }
}

export default Loader
