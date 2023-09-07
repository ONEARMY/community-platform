// import { useTheme } from '@emotion/react'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { EmailNotificationFrequency } from 'oa-shared'
import { useCommonStores } from 'src'
import { Card, Flex, Heading } from 'theme-ui'
import { logger } from 'src/logger'

const LOADING_TEXT = 'Please wait...'
const SUCCESS_TEXT =
  'You have been unsubscibed. You can log in to change your email settings.'
const ERROR_TEXT =
  'Oops, something went wrong. Please log in to change your email settings.'

const Unsubscribe = observer(({ userName }: { userName: string }) => {
  const [statusText, setStatusText] = useState(LOADING_TEXT)
  const { userStore } = useCommonStores().stores

  useEffect(() => {
    const unsubscribeUser = async () => {
      try {
        const user = await userStore.getUserByUsername(userName)
        if (!user) {
          throw new Error('User not found.')
        }
        await userStore.updateUserProfile(
          {
            ...user,
            notification_settings: {
              emailFrequency: EmailNotificationFrequency.NEVER,
            },
          },
          'unsubscribe',
          userName,
        )
        setStatusText(SUCCESS_TEXT)
      } catch (error) {
        logger.debug('Error unsubscribing user:', error)
        setStatusText(ERROR_TEXT)
      }
    }

    unsubscribeUser()
  }, [])

  return (
    <Flex
      sx={{ flexDirection: 'column', maxWidth: '400px', textAlign: 'center' }}
      mx="auto"
      mt={15}
    >
      <Card p={3} bg={'softblue'} sx={{}} mb={3}>
        <Heading>Unsubscribe </Heading>
      </Card>
      {statusText}
    </Flex>
  )
})

const UnsubscribeRoutes = () => (
  <Router>
    <Switch>
      <Route
        exact
        path="/unsubscribe/:userName"
        component={(props) => (
          <Unsubscribe userName={props.match.params.userName} />
        )}
      ></Route>
    </Switch>
  </Router>
)

export default UnsubscribeRoutes
