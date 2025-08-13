import { observer } from 'mobx-react-lite'
import { Select } from 'oa-components'
import { UserRole } from 'oa-shared'
import { SITE, VERSION } from 'src/config/config'
import { getDevSiteRole } from 'src/config/devSiteConfig'
import { Flex, Text } from 'theme-ui'

/**
 * A simple header component that reminds developers that they are working on a dev
 * version of the platform, and provide the option to toggle between different dev sites
 */
const DevSiteHeader = observer(() => {
  return (
    <>
      {showDevSiteHeader() && (
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f58d8e',
            padding: 1,
            zIndex: 3001,
            flexDirection: ['column', 'row'],
            gap: 2,
            fontSize: 2,
          }}
        >
          <Text color="white">
            This is a dev version of the platform (v{VERSION})
          </Text>
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <Text color={'white'} title={SITE} sx={{ fontSize: 2 }}>
              View as:
            </Text>
            <Select
              options={siteRoles}
              placeholder="Role"
              defaultValue={
                siteRoles.find((s) => s.value === getDevSiteRole()) ||
                siteRoles[0]
              }
              onChange={(s: any) => setSiteRole(s.value)}
            />
            <Text color={'white'} title={SITE} sx={{ fontSize: 2 }}>
              Site:
            </Text>
            <Select
              options={devSites}
              placeholder="Site"
              defaultValue={devSites.find((s) => s.value === SITE)}
              onChange={(s: any) => setSite(s.value)}
            />
          </Flex>
        </Flex>
      )}
    </>
  )
})

const showDevSiteHeader = () =>
  devSites.some((s) => s.value === SITE) ||
  window.location?.hostname === 'localhost'

// we have 2 different dev sites, only show this component when on one and provide select
const devSites = [
  { value: 'localhost', label: 'Dev' },
  { value: 'preview', label: 'Preview' },
]
// dev site users can use either a default user profile or mock another admin role
const siteRoles: { value: UserRole | string; label: string }[] = [
  { value: '', label: 'User' },
  { value: UserRole.BETA_TESTER, label: 'Beta Tester' },
  { value: UserRole.ADMIN, label: 'Admin' },
  // { value: 'super-admin', label: 'Super Admin' },
]

/** Use localStorage to specify a site that will update from src/config */
const setSite = async (site: string) => {
  await clearCache(false)
  localStorage.setItem('devSiteVariant', site)
  localStorage.setItem('devSiteRole', getDevSiteRole())
  window.location.reload()
}

/** Use localStorage to specify a role that can be applied while testing on dev sites */
const setSiteRole = async (role: string) => {
  if (role) {
    localStorage.setItem('devSiteRole', role)
  } else {
    localStorage.removeItem('devSiteRole')
  }
  window.location.reload()
}

/** Delete local,session and indexedDB storage */
const clearCache = (reload = true) => {
  return new Promise((resolve) => {
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
