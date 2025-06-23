import { useEffect, useState } from 'react'
import { useNavigate } from '@remix-run/react'
import { toJS } from 'mobx'
import { Button, ConfirmModal } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { fields } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Input, Label, Text } from 'theme-ui'

export const DeleteAccount = () => {
  const { mapsStore, userStore } = useCommonStores().stores
  const { description, title } = fields.deleteAccount
  const [deleteInputVal, setDeleteInputVal] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [confirmButtonDisabled, setConfirmButtonDisabled] =
    useState<boolean>(true)
  const navigate = useNavigate()

  const openModal = () => {
    setShowDeleteModal(true)
  }

  const closeModal = () => {
    setShowDeleteModal(false)
  }

  // TODO - Fix issues with focus/possible re-renders on keydown within the input
  const onDeleteInputChange = (e) => {
    setDeleteInputVal(e.target.value)
  }

  useEffect(() => {
    if (deleteInputVal === 'DELETE') {
      setConfirmButtonDisabled(false)
    } else if (confirmButtonDisabled === false) {
      setConfirmButtonDisabled(true)
    }
  }, [deleteInputVal])

  const deleteAccount = async () => {
    // TODO - delete the user from the required places
    const user = userStore.activeUser

    if (user) {
      const updatedUser = await userStore.deleteUserLocation(user)
      if (updatedUser) {
        await mapsStore.deleteUserPin(toJS(updatedUser))
      }
    }

    closeModal()

    // Redirect user to logout
    navigate('/logout')
  }

  return (
    <Flex
      sx={{
        alignItems: 'center',
        backgroundColor: 'offWhite',
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        gap: [2, 4],
      }}
    >
      <Flex sx={{ flexDirection: 'row', gap: [2, 4] }}>
        <Flex sx={{ flexDirection: 'column', flex: 1, gap: [2] }}>
          <Heading as="h3" variant="small">
            {title}
          </Heading>
          <Text variant="quiet">{description}</Text>
        </Flex>
      </Flex>

      <Button type="button" onClick={openModal} variant="danger">
        {title}
      </Button>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Permanently delete this account?"
        message="Deleting your account will remove all your information from our database. This cannot be undone."
        width={512}
        confirmButtonText="Delete account"
        confirmButtonVariant="danger"
        handleCancel={closeModal}
        handleConfirm={deleteAccount}
        disableConfirm={confirmButtonDisabled}
      >
        <Label htmlFor="deleteInput" sx={{ marginTop: '30px' }}>
          Type “DELETE” to proceed
        </Label>
        <Input
          id="deleteInput"
          name="deleteInput"
          sx={{ marginBottom: '30px' }}
          onChange={onDeleteInputChange}
          value={deleteInputVal}
        />
      </ConfirmModal>
    </Flex>
  )
}
