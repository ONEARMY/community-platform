import { observer } from 'mobx-react'
import { useEffect, useMemo } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useLocation,
} from 'react-router-dom'
import { Loader } from 'oa-components'
import { logger } from 'src/logger'
import { functions } from 'src/utils/firebase'

const Patreon = observer(() => {
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
        window.location.replace('/')
      }
      throw new Error(resp.data.error)
    } catch (error) {
      logger.debug('Error calling the authentication endpoint', error)
    }
  }

  useEffect(() => {
    if (patreonCode) {
      triggerAuth(patreonCode)
    }
  }, [patreonCode])

  return <Loader />
})

const PatreonRoute = () => (
  <Router>
    <Switch>
      <Route exact path="/patreon" component={() => <Patreon />}></Route>
    </Switch>
  </Router>
)

export default PatreonRoute
