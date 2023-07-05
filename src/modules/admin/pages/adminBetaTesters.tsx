import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/index'
import { Button, Loader } from 'oa-components'
import { Heading, Box, Text, Input, Flex } from 'theme-ui'
import { AuthWrapper } from 'src/common/AuthWrapper'

const adminBetaTesters = observer(() => {
  const [{ updating, userInput, errorMsg }, setFormData] = useState({
    updating: false,
    userInput: '',
    errorMsg: '',
  })
  const {
    stores: { adminStore },
  } = useCommonStores()
  const { betaTesters } = adminStore
  const loading = betaTesters.length === 0

  useEffect(() => {
    if (loading) adminStore.init()
  }, [])

  if (loading) return <Loader />

  const addBetaTester = async () => {
    const username = userInput as string
    setFormData((current) => ({ ...current, errorMsg: '', updating: true }))

    try {
      await adminStore.addUserRole(username, 'beta-tester')
      setFormData((current) => ({ ...current, userInput: '', updating: false }))
    } catch (error) {
      setFormData((current) => ({
        ...current,
        errorMsg: error.message,
        updating: false,
      }))
    }
  }

  const removeBetaTester = async (username: string) => {
    setFormData((current) => ({ ...current, errorMsg: '', updating: true }))

    try {
      await adminStore.removeUserRole(username, 'beta-tester')
      setFormData((current) => ({ ...current, updating: false }))
    } catch (error) {
      setFormData((current) => ({
        ...current,
        errorMsg: error.message,
        updating: false,
      }))
    }
  }

  const handleInputChange = (e) =>
    setFormData((current) => ({ ...current, userInput: e.target.value }))

  const disabled = userInput === '' || updating

  return (
    <Box mt={4}>
      <Heading>List of Beta Testers</Heading>
      <Box mb={3} bg={'white'} p={2}>
        {betaTesters.map(({ userName }, index) => (
          <Flex key={`user-${index}`}>
            <Text sx={{ flex: 1 }}>{userName}</Text>
            <AuthWrapper roleRequired="admin">
              <Button
                icon="delete"
                disabled={updating}
                onClick={() => removeBetaTester(userName)}
                data-testid={`remove-role-${userName}`}
              />
            </AuthWrapper>
          </Flex>
        ))}
      </Box>
      <Box mb={3} bg={'white'} p={2}>
        <Input
          type="text"
          placeholder="Username"
          value={userInput}
          onChange={handleInputChange}
        />
        <Button disabled={disabled} onClick={addBetaTester}>
          Add beta tester
        </Button>
        {errorMsg && <Text color="red">{errorMsg}</Text>}
      </Box>
    </Box>
  )
})

export default adminBetaTesters
