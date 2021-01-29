import * as React from 'react'

import { SITE } from 'src/config/config'
import Text from 'src/components/Text'
import theme from 'src/themes/styled.theme'
import { Flex, Box } from 'rebass'
import { Button } from '../Button'

/**
 * A simple header component that reminds developers that they are working on a dev
 * version of the platform, and provide the option to toggle between different dev sites
 */
const DevSiteHeader = () => (
  <>
    {devSites.includes(SITE) && (
      <Flex
        data-cy="devSiteHeader"
        bg={theme.colors.red2}
        width={1}
        py={1}
        px={1}
        alignItems="center"
      >
        <Text color={'white'} medium txtcenter flex="1">
          This is a dev version of the platform
        </Text>
        <Box />
        {devSites
          .filter(s => SITE !== s)
          .map(s => (
            <Button
              key="site"
              small
              variant="outline"
              onClick={() => setSite(s)}
              icon="arrow-forward"
            >
              {s === 'localhost' ? 'dev' : s}
            </Button>
          ))}
      </Flex>
    )}
  </>
)
// we have 2 different dev sites,
const devSites = ['localhost', 'preview']

/** Use url search params to specify a site that will update from src/config */
const setSite = async (site: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set('site', site)
  await clearCache(false)
  window.location.href = url.href
}

/** Delete local,session and indexedDB storage */
const clearCache = (reload = true) => {
  return new Promise(async resolve => {
    console.log('clearing cache')
    localStorage.clear()
    sessionStorage.clear()
    const req = indexedDB.deleteDatabase('OneArmyCache')
    req.onsuccess = () => {
      if (reload) {
        window.location.reload()
      }
      resolve(true)
    }
    req.onerror = () => {
      if (reload) {
        window.location.reload()
      }
      resolve(false)
    }
  })
}

export default DevSiteHeader
