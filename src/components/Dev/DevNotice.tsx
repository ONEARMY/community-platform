import * as React from 'react'
import { colors } from 'src/themes/styled.theme'
import { FaExclamationTriangle } from 'react-icons/fa'
import { SITE } from 'src/config/config'
export const DevNotice = () =>
  SITE !== 'production' ? (
    <div
      style={{
        padding: '5px',
        color: colors.green,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
      }}
      title="This site is for development purposes, do not share private information"
    >
      <span>Dev site notice</span>
      <FaExclamationTriangle style={{ marginLeft: 5 }} />
    </div>
  ) : null
