import { useState } from 'react'
import { useNavigate } from '@remix-run/react'
import { toJS } from 'mobx'
import { Button, DeleteProfileModal } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { fields } from 'src/pages/UserSettings/labels'
import { Flex, Heading, Text } from 'theme-ui'

export const DeleteAccount = () => {
  const { mapsStore, userStore } = useCommonStores().stores
  const { description, title } = fields.deleteAccount
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const navigate = useNavigate()

  const openModal = () => {
    setShowDeleteModal(true)
  }

  const closeModal = () => {
    setShowDeleteModal(false)
  }

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

    navigate('/api/profile/delete')
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

      <DeleteProfileModal
        isOpen={showDeleteModal}
        handleCancel={closeModal}
        handleConfirm={deleteAccount}
      />
    </Flex>
  )
}
