// import { useTheme } from '@emotion/react'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { EmailNotificationFrequency } from 'oa-shared'
import { useCommonStores } from 'src'
import { Card, Flex, Heading, Text } from 'theme-ui'
import { logger } from 'src/logger'

enum Status {
  LOADING,
  SUCCESS,
  ERROR,
}

const StatusMessage = ({ status }: { status: Status }) => {
  const loginLink = (
    <a
      href="/sign-in"
      style={{
        textDecoration: 'underline',
        color: 'inherit',
        display: 'inline',
      }}
    >
      login
    </a>
  )

  switch (status) {
    case Status.LOADING:
      return <Text>Please wait...</Text>
    case Status.SUCCESS:
      return (
        <Text>
          You have been unsubscibed. You can {loginLink} to change your email
          settings.
        </Text>
      )
    case Status.ERROR:
      return (
        <Text>
          Oops, something went wrong. Please {loginLink} to change your email
          settings.
        </Text>
      )
  }
}

const Unsubscribe = observer(({ userName }: { userName: string }) => {
  const [status, setStatus] = useState<Status>(Status.LOADING)
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
        setStatus(Status.SUCCESS)
      } catch (error) {
        logger.debug('Error unsubscribing user:', error)
        setStatus(Status.ERROR)
      }
    }

    unsubscribeUser()
  }, [])

  return (
    <Flex
      sx={{ flexDirection: 'column', maxWidth: '400px', textAlign: 'center' }}
      mx="auto"
      mt={15}
      data-cy="unsubscribe"
    >
      <Card p={3} bg={'softblue'} sx={{}} mb={3}>
        <Heading>Unsubscribe </Heading>
      </Card>
      <StatusMessage status={status} />
    </Flex>
  )
})

const UnsubscribeRoute = () => (
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

export default UnsubscribeRoute
