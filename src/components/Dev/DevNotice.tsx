import * as React from 'react'
import theme from 'src/themes/styled.theme'
import { FaExclamationTriangle } from 'react-icons/fa'
import { SITE, VERSION } from 'src/config/config'
import Text from 'src/components/Text'
import { Link } from 'rebass'

export const DevNotice = () =>
  SITE !== 'production' ? (
    <Text bg="background" color={'black'} width={1} py={2} medium txtcenter>
      This is the alpha version (v{VERSION}) of onearmy platform, click{' '}
      <Link target="_blank" href="https://build.onearmy.world">
        here
      </Link>{' '}
      to help building it.
      <br />
      /!\ This site is for development purposes, do not share private
      information
    </Text>
  ) : (
    <Text bg="background" color={'black'} width={1} py={2} medium txtcenter>
      This is the alpha version (v{VERSION}) of onearmy platform, click{' '}
      <Link target="_blank" href="https://build.onearmy.world">
        here
      </Link>{' '}
      to help building it.
    </Text>
  )
