import { useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import { Loader } from 'oa-components'
import { logger } from 'src/logger'
import { functions } from 'src/utils/firebase'
import { Flex, Text } from 'theme-ui'

const Patreon = () => {
  const [error, setError] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const patreonCode = searchParams.get('code')

  const triggerAuth = async (patreonCode: string) => {
    try {
      const resp = await functions.httpsCallable('integrations-patreonAuth')({
        code: patreonCode,
      })
      if (resp.data?.success) {
        logger.debug('Successfully authenticated with Patreon')
        window.location.replace('/settings/account')
        return
      }
      throw new Error(resp.data.error)
    } catch (error) {
      logger.debug('Error calling the authentication endpoint', error)
      setError(true)
    }
  }

  useEffect(() => {
    if (patreonCode) {
      triggerAuth(patreonCode)
    }
  }, [patreonCode])

  return error ? (
    <Flex
      sx={{ flexDirection: 'column', maxWidth: '400px', textAlign: 'center' }}
      mx="auto"
      mt={15}
    >
      <Text>
        Sorry, we encountered an error integrating your Patreon account. Please
        try again later!
      </Text>
    </Flex>
  ) : (
    <Loader />
  )
}

export default Patreon
