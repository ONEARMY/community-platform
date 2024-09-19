import { useTheme } from '@emotion/react'
import { Link } from '@remix-run/react'
import { observer } from 'mobx-react'
import { VERSION } from 'src/config/config'
import { Box, Flex, Image, Text } from 'theme-ui'

const Logo = observer(() => {
  const theme = useTheme()

  const name = import.meta.env.VITE_SITE_NAME || process.env.VITE_SITE_NAME
  const logo = theme.logo

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
            style={{ maxWidth: 100, maxHeight: 100 }}
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
