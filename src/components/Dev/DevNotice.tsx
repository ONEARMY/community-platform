import * as React from 'react'
import colors from 'src/themes/colors'
import { FaExclamationTriangle } from 'react-icons/fa'
import { SITE } from 'src/config/config'
export const DevNotice = () =>
  SITE !== 'production' ? (
    <div style={{padding: '5px 5px', color: colors.green}}
    title="This site is for development purposes, do not share private information" >
      <a style={{position: 'absolute', right: 200}}>Dev site notice</a>
      <FaExclamationTriangle 
      style={{position: 'absolute', right: 175}}/>
    </div>
  ) : (
    <div />
  )
