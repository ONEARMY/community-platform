import * as React from 'react'

import DevTools from 'mobx-react-devtools'
import { SITE, VERSION } from 'src/config/config'
import Text from 'src/components/Text'
import { Link } from 'rebass'

const DevHelpers = () =>
  SITE !== 'production' ? (
    <>
      <DevTools />
      <Text bg={'black'} color={'white'} width={1} py={2} medium txtcenter>
        This is the alpha version (v{VERSION}) of onearmy platform, click{' '}
        <Link target="_blank" href="https://build.onearmy.world">
          here
        </Link>{' '}
        to help building it. /!\ This site is for development purposes, do not
        share private information
      </Text>
    </>
  ) : (
    <Text bg="background" color={'black'} width={1} py={2} medium txtcenter>
      This is the alpha version (v{VERSION}) of onearmy platform, click{' '}
      <Link target="_blank" href="https://build.onearmy.world">
        here
      </Link>{' '}
      to help building it.
    </Text>
  )

export default DevHelpers
