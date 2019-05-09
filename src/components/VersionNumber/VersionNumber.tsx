import * as React from 'react'
import { VERSION } from 'src/config/config'

/*
A simple component to render the current build version number.
This number is from the version in package.json and passed as an environment variable
*/

const styles: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
  color: '#313131',
  opacity: 0.4,
  position: 'absolute',
  bottom: '16px',
}
const VersionNumber = () => <div style={styles}>v{VERSION}</div>

export { VersionNumber }
