import { useContext } from 'react'
import { Banner } from 'oa-components'
import { getSupportedModules, MODULE } from 'src/modules'
import { EnvironmentContext } from 'src/pages/common/EnvironmentContext'
import { Flex } from 'theme-ui'

import { UserAction } from '../UserAction'
import { AlertIncompleteProfile } from './AlertIncompleteProfile'
import { AlertProfileVerification } from './AlertProfileVerification'

export const Alerts = () => {
  const env = useContext(EnvironmentContext)

  const isLibraryOn = getSupportedModules(
    env?.VITE_SUPPORTED_MODULES || '',
  ).includes(MODULE.HOWTO)

  return (
    <UserAction
      loggedIn={
        <>
          <AlertProfileVerification />
          <AlertIncompleteProfile />
          {isLibraryOn && (
            <Flex>
              <Banner
                sx={{
                  backgroundColor: 'softblue',
                  color: 'black',
                  cursor: 'cursor',
                }}
              >
                Announcement: We're making changes behindd the scenes to the
                Library, so things might be weird over there! If you notice
                something, please report the problem.
              </Banner>
            </Flex>
          )}
        </>
      }
      loggedOut={null}
    />
  )
}
