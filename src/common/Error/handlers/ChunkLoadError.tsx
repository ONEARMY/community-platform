import { Button } from 'oa-components'
import { useEffect } from 'react'
import { Box, Text } from 'theme-ui'
import { attemptReload, isReloaded } from './Reloader'

/**
 * Handle screen-of-death issue where the user has tried to load JS code that no longer exists on the server
 * https://stackoverflow.com/questions/44601121/code-splitting-causes-chunks-to-fail-to-load-after-new-deployment-for-spa
 * https://github.com/facebook/create-react-app/issues/5316
 *
 * Will attempt to reload browser first time error seen, and display message to user if still persists
 * Adapted from https://mitchgavan.com/code-splitting-react-safely/
 */
export const ChunkLoadErrorHandler = () => {
  // when error first seen attempt to resolve with a reload
  useEffect(() => {
    attemptReload()
  })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        paddingBottom: '20vh',
      }}
    >
      {isReloaded() && (
        <>
          <Text mb={4} sx={{ fontSize: 3 }}>
            The website got some updates
          </Text>
          <Button onClick={() => attemptReload()}>Load the new site.</Button>
          <Text mt={4} sx={{ fontSize: 0.75 }}>
            If it doesn't work you might need to close and re-open your browser
            <br></br>Or send us a{' '}
            <a href="mailto:platform@onearmy.earth?subject=Platform%20Bugs">
              mail
            </a>
            , happy to help :)
          </Text>
        </>
      )}
    </Box>
  )
}
