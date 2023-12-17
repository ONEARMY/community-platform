import { observer } from 'mobx-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useLocation,
} from 'react-router-dom'
import { Loader } from 'oa-components'
import { logger } from 'src/logger'
import { functions } from 'src/utils/firebase'
import { Text, Flex } from 'theme-ui'

const Patreon = observer(() => {
  const [error, setError] = useState<boolean>(false)
  const { search } = useLocation()

  const patreonCode = useMemo(() => {
    const query = new URLSearchParams(search)
    return query.get('code')
  }, [search])

  const triggerAuth = async (patreonCode: string) => {
    try {
      const resp = await functions.httpsCallable('integrations-patreonAuth')({
        code: patreonCode,
      })
      if (resp.data?.success) {
        logger.debug('Successfully authenticated with Patreon')
        window.location.replace('/settings')
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
})

const PatreonRoute = () => (
  <Router>
    <Switch>
      <Route exact path="/patreon" component={() => <Patreon />}></Route>
    </Switch>
  </Router>
)

export default PatreonRoute
