import * as React from 'react'

import DevTools from 'mobx-react-devtools'
import { SITE, VERSION } from 'src/config/config'
import Text from 'src/components/Text'
import { Link } from 'rebass/styled-components'
import theme from 'src/themes/styled.theme'

const DevHelpers = () => (
  <>
    {SITE !== 'production' && <DevTools />}
    <Text
      bg={theme.colors.red2}
      color={'white'}
      width={1}
      py={2}
      medium
      txtcenter
      style={{ zIndex: 9999, position: 'relative' }}
    >
      You have early access to this platform !{' '}
      <Link
        color={theme.colors.blue}
        target="_blank"
        href="https://github.com/ONEARMY/community-platform"
      >
        (v{VERSION})
      </Link>{' '}
      Official launch is on 7th Jan 2020. Don’t share any of its contents yet.
      We trust you :)
    </Text>
  </>
)

export default DevHelpers
