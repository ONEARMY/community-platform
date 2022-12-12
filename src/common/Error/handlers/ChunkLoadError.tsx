import { Button } from 'oa-components'
import { useEffect } from 'react'
import { Box, Text } from 'theme-ui'

/**
 * Handle screen-of-death issue where the user has tried to load JS code that no longer exists on the server
 * https://stackoverflow.com/questions/44601121/code-splitting-causes-chunks-to-fail-to-load-after-new-deployment-for-spa
 *
 * Will attempt to reload browser first time error seen, and display message to user if still persists
 * Adapted from https://mitchgavan.com/code-splitting-react-safely/
 */
export const ChunkLoadErrorHandler = () => {
  const isReloaded = getWithExpiry('error_reload') ? true : false

  useEffect(() => {
    toggleReload()
  })

  /** attempt to reload, use localstorage utility methods to avoid infinite loops */
  const toggleReload = () => {
    if (!isReloaded) {
      setWithExpiry('error_reload', 'true', 10000)
      window.location.reload()
    }
  }

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
      {isReloaded && (
        <>
          <Text mb={4} sx={{ fontSize: 3 }}>
            The website got some updates
          </Text>
          <Button onClick={() => toggleReload()}>Load the new site.</Button>
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

function setWithExpiry(key: string, value: string, ttl: number) {
  const item = {
    value: value,
    expiry: new Date().getTime() + ttl,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key: string): string | null {
  const itemString = window.localStorage.getItem(key)
  if (!itemString) return null

  const item = JSON.parse(itemString)
  const isExpired = new Date().getTime() > item.expiry

  if (isExpired) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}
