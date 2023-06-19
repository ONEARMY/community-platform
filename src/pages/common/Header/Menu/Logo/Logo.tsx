import { Component } from 'react'
import { Flex, Image, Text, Box } from 'theme-ui'
import { inject, observer } from 'mobx-react'
import type { ThemeStore } from 'src/stores/Theme/theme.store'
import { VERSION } from 'src/config/config'
import { Link } from 'react-router-dom'

interface IProps {
  isMobile?: boolean
}

interface InjectedProps {
  themeStore: ThemeStore
}

@inject('themeStore')
@observer
export class Logo extends Component<IProps> {
  // eslint-disable-next-line
  constructor(props: any) {
    super(props)
  }

  get injected() {
    return this.props as InjectedProps
  }

  render() {
    const name = this.injected.themeStore?.currentTheme.siteName
    const logo = this.injected.themeStore?.currentTheme.logo

    const nameAndVersion = `${name} logo ${VERSION}`

    return (
      <Box
        sx={{
          py: ['10px', '10px', 0], // padding on y axes ( top & bottom )
          marginBottom: [0, 0, '-50px'],
          position: 'relative',
        }}
      >
        <Link to="/">
          <Flex
            ml={[0, 4]}
            sx={{
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              width: ['50px', '50px', '100px'],
              height: ['50px', '50px', '100px'],
            }}
          >
            <Image
              loading="lazy"
              src={logo}
              sx={{
                width: [50, 50, 100],
                height: [50, 50, 100],
              }}
              alt={nameAndVersion}
              title={nameAndVersion}
            />
          </Flex>
          <Text
            className="sr-only"
            ml={2}
            sx={{ display: ['none', 'none', 'block'] }}
            color="black"
          >
            {name}
          </Text>
        </Link>
      </Box>
    )
  }
}

export default Logo
