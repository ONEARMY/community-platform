import { Flex, Image, Text, Box } from 'theme-ui'
import { observer } from 'mobx-react'
import { VERSION } from 'src/config/config'
import { Link } from 'react-router-dom'
import { useCommonStores } from 'src/index'

const Logo = observer(() => {
  const { themeStore } = useCommonStores().stores

  const name = themeStore?.currentTheme.siteName
  const logo = themeStore?.currentTheme.logo

  const nameAndVersion = `${name} logo ${VERSION}`
  const logoSize = [50, 50, 100]

  return (
    <Box
      sx={{
        py: [2, 2, 0], // padding on y axes ( top & bottom )
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
            width: logoSize,
            height: logoSize,
          }}
        >
          <Image
            loading="lazy"
            src={logo}
            sx={{
              width: logoSize,
              height: logoSize,
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
})

export default Logo
