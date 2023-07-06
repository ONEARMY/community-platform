import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/index'
import { Button, Loader } from 'oa-components'
import { Heading, Box, Text, Input, Flex } from 'theme-ui'
import { AuthWrapper } from 'src/common/AuthWrapper'

const adminAdminUsers = observer(() => {
  const [{ updating, userInput, errorMsg }, setFormData] = useState({
    updating: false,
    userInput: '',
    errorMsg: '',
  })
  const {
    stores: { adminStore },
  } = useCommonStores()
  const { admins, superAdmins } = adminStore
  const loading = admins.length === 0

  useEffect(() => {
    if (loading) adminStore.init()
  }, [])

  if (loading) return <Loader />

  const disabled = userInput === '' || updating

  const addAdmin = async () => {
    const username = userInput as string

    try {
      await adminStore.addUserRole(username, 'admin')
      setFormData((current) => ({ ...current, userInput: '', updating: false }))
    } catch (error) {
      setFormData((current) => ({
        ...current,
        errorMsg: error.message,
        updating: false,
      }))
    }
  }

  const removeAdmin = async (username: string) => {
    setFormData((current) => ({ ...current, errorMsg: '', updating: true }))

    try {
      await adminStore.removeUserRole(username, 'admin')
      setFormData((current) => ({ ...current, updating: false }))
    } catch (error) {
      setFormData((current) => ({ ...current, errorMsg: error.message }))
    }
  }

  const handleInputChange = (e) =>
    setFormData((current) => ({ ...current, userInput: e.target.value }))

  return (
    <Box mt={4}>
      <Heading>List of Super Admins</Heading>
      <Box mb={3} bg={'white'} p={2}>
        {superAdmins.map(({ userName }, index) => (
          <Flex key={`super-admin-${index}`}>
            <Text sx={{ flex: 1 }}>{userName}</Text>
          </Flex>
        ))}
      </Box>
      <Heading>List of Admins</Heading>
      <Box mb={3} bg={'white'} p={2}>
        {admins.map(({ userName }, index) => (
          <Flex key={`admin-${index}`}>
            <Text sx={{ flex: 1 }}>{userName}</Text>
            <AuthWrapper roleRequired="super-admin">
              <Button
                icon="delete"
                disabled={updating}
                onClick={() => removeAdmin(userName)}
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
        <Button disabled={disabled} onClick={addAdmin}>
          Add admin
        </Button>
        {errorMsg && <Text color="red">{errorMsg}</Text>}
      </Box>
    </Box>
  )
})

export default adminAdminUsers
