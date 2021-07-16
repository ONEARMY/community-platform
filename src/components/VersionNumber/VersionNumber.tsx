import { VERSION } from 'src/config/config'
import Text from 'src/components/Text'

/*
A simple component to render the current build version number.
This number is from the version in package.json and passed as an environment variable
*/

const VersionNumber = () => (
  <Text mt={3} textAlign={'center'}>
    v{VERSION}
  </Text>
)

export { VersionNumber }
