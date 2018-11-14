import * as React from 'react'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

/*
A simple component to render the current build version number.
This number is from the version in package.json and passed as an environment variable
*/

const styles: CSSProperties = {
  right: 20,
  color: '#313131',
  bottom: 0,
  position: 'fixed',
  opacity: 0.7,
}
const VersionNumber = () => (
  <div style={styles}>Version: {process.env.REACT_APP_PLATFORM_VERSION}</div>
)

export { VersionNumber }
