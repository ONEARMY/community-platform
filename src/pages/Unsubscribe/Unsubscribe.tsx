import { useEffect, useState } from 'react'
import { Route, Routes, useParams } from '@remix-run/react'
import { observer } from 'mobx-react'
import { ReturnPathLink } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { Card, Flex, Heading, Text } from 'theme-ui'

enum Status {
  LOADING,
  SUCCESS,
  ERROR,
}

const StatusMessage = ({ status }: { status: Status }) => {
  const loginLink = (
    <ReturnPathLink
      to="/sign-in"
      style={{
        textDecoration: 'underline',
        color: 'inherit',
        display: 'inline',
      }}
    >
      login
    </ReturnPathLink>
  )

  switch (status) {
    case Status.LOADING:
      return <Text>Please wait...</Text>
    case Status.SUCCESS:
      return (
        <Text>
          You have been unsubscribed. You can {loginLink} to change your email
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

const Unsubscribe = observer(() => {
  const { unsubscribeToken } = useParams()
  const [status, setStatus] = useState<Status>(Status.LOADING)
  const { userStore } = useCommonStores().stores

  useEffect(() => {
    const unsubscribeUser = async () => {
      try {
        if (unsubscribeToken) {
          await userStore.unsubscribeUser(unsubscribeToken)
          setStatus(Status.SUCCESS)
        }
      } catch (error) {
        logger.debug('Error unsubscribing user:', error)
        setStatus(Status.ERROR)
      }
    }

    unsubscribeUser()
  })

  return (
    <Flex
      sx={{ flexDirection: 'column', maxWidth: '400px', textAlign: 'center' }}
      mx="auto"
      mt={15}
      data-cy="unsubscribe"
    >
      <Card p={3} bg={'softblue'} sx={{}} mb={3}>
        <Heading>Unsubscribe</Heading>
      </Card>
      <StatusMessage status={status} />
    </Flex>
  )
})

const UnsubscribeRoute = () => (
  <Routes>
    <Route path=":unsubscribeToken" element={<Unsubscribe />}></Route>
  </Routes>
)

export default UnsubscribeRoute
