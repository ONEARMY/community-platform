import * as React from 'react'
import theme from 'src/themes/styled.theme'
import { FaExclamationTriangle } from 'react-icons/fa'
import { SITE, VERSION } from 'src/config/config'

export const DevNotice = () =>
  SITE !== 'production' ? (
    <div
      style={{
        marginLeft: '5px',
        color: theme.colors.green,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
      }}
      title="This site is for development purposes, do not share private information"
    >
      <span>v{VERSION}</span>
      <FaExclamationTriangle style={{ marginLeft: 5 }} />
    </div>
  ) : null
