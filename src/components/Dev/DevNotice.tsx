import * as React from 'react'
import colors from 'src/themes/colors'
import { FaExclamationTriangle } from 'react-icons/fa'
import { isDebug } from 'src/config/config'
export const DevNotice = () =>
  isDebug ? (
    <FaExclamationTriangle
      color={colors.green}
      style={{ position: 'absolute', right: 175, padding: '5px 5px' }}
    />
  ) : (
    <div />
  )
