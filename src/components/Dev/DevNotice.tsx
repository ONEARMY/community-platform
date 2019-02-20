import * as React from 'react'
import colors from 'src/themes/colors'
import { FaExclamationTriangle } from 'react-icons/fa'
import { SITE } from 'src/config/config'
export const DevNotice = () =>
  SITE !== 'production' ? (
    <FaExclamationTriangle
      color={colors.green}
      style={{ position: 'absolute', right: 175, padding: '5px 5px' }}
    />
  ) : (
    <div />
  )
