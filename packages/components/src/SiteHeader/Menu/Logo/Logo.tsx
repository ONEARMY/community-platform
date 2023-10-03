import { Flex, Image, Text, Box } from 'theme-ui'
import { Link } from 'react-router-dom'
import { useTheme } from '@emotion/react'

export const Logo = () => {
  const theme = useTheme() as any
  const name = theme.siteName
  const logo = theme.logo

  const nameAndVersion = `${name} logo`
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
}
