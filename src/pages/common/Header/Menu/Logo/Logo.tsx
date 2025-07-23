import { Link } from '@remix-run/react'
import { observer } from 'mobx-react'
import { UserRole } from 'oa-shared'
import { ClientOnly } from 'remix-utils/client-only'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { VERSION } from 'src/config/config'
import { Flex, Image, Text, useThemeUI } from 'theme-ui'

import type { ThemeWithName } from 'oa-themes'

const Logo = observer(() => {
  const themeUi = useThemeUI()
  const theme = themeUi.theme as ThemeWithName

  const name = import.meta.env.VITE_SITE_NAME || process.env.VITE_SITE_NAME
  const logo = theme.logo

  const nameAndVersion = `${name} logo ${VERSION}`
  const logoSize = [60, 75, 75, 100]

  return (
    <Flex
      sx={{
        paddingY: 2,
        paddingX: 3,
        position: 'fixed',
        zIndex: 6000,
        alignItems: 'center',
      }}
    >
      <Link to="/">
        <Flex
          sx={{
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
          sx={{ display: ['none', 'none', 'block'] }}
          color="black"
        >
          {name}
        </Text>
      </Link>
      <ClientOnly fallback={<></>}>
        {() => (
          <AuthWrapper roleRequired={UserRole.BETA_TESTER} borderLess>
            <Text
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: ['1rem', '1.4rem'],
                borderRadius: '4px',
                padding: '2px 6px',
                backgroundColor: 'lightgrey',
                marginLeft: [2, 4],
              }}
            >
              BETA
            </Text>
          </AuthWrapper>
        )}
      </ClientOnly>
    </Flex>
  )
})

export default Logo
