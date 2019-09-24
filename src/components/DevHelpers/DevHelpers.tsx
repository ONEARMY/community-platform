import * as React from 'react'

import DevTools from 'mobx-react-devtools'
import { SITE, VERSION } from 'src/config/config'
import Text from 'src/components/Text'
import { Link } from 'rebass/styled-components'

const DevHelpers = () => (
  <>
    {SITE !== 'production' && <DevTools />}
    <Text bg={'black'} color={'white'} width={1} py={2} medium txtcenter>
      This is the alpha version (v{VERSION}) of onearmy platform,{' '}
      <Link target="_blank" href="https://build.onearmy.world">
        click here
      </Link>{' '}
      to help building it. /!\ This site is for development purposes, do not
      share private information
    </Text>
  </>
)

export default DevHelpers
