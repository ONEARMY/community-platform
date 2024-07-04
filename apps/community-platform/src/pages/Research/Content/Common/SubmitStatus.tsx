import { useNavigate } from 'react-router-dom'
import { Button, Icon, Modal } from '@onearmy.apps/components'
import { observer } from 'mobx-react'
import { Box, Flex, Heading, Text } from 'theme-ui'

import { useResearchStore } from '../../../../stores/Research/research.store'

interface IProps {
  onClose: () => void
}

export const ResearchSubmitStatus = observer((props: IProps) => {
  const navigate = useNavigate()
  const store = useResearchStore()

  return (
    <Modal isOpen={store.researchUploadStatus.Start}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading as="p" variant="small" sx={{ textAlign: 'center' }}>
          Uploading Research
        </Heading>
        <Icon
          glyph={'close'}
          onClick={() => {
            props.onClose()
          }}
        />
      </Flex>
      <Box margin="15px 0" p={0}>
        {Object.keys(store.researchUploadStatus).map((key) => (
          <Flex p={0} sx={{ alignItems: 'center' }} key={key}>
            <Icon
              marginRight="4px"
              glyph={store.researchUploadStatus[key] ? 'check' : 'loading'}
            />
            <Text>| {key}</Text>
          </Flex>
        ))}
      </Box>
      {store.activeResearchItem && store.activeResearchItem?.slug ? (
        <Button
          data-cy={store.researchUploadStatus.Complete ? 'view-research' : ''}
          disabled={!store.researchUploadStatus.Complete}
          variant={
            !store.researchUploadStatus.Complete ? 'disabled' : 'outline'
          }
          icon="arrow-forward"
          onClick={() => {
            navigate('/research/' + store.activeResearchItem!.slug)
            props.onClose()
          }}
        >
          View Research
        </Button>
      ) : null}
    </Modal>
  )
})

export const UpdateSubmitStatus = observer((props: IProps) => {
  const navigate = useNavigate()
  const store = useResearchStore()
  const uploadStatus = store.updateUploadStatus

  return (
    <Modal isOpen={uploadStatus.Start}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading as="p" variant="small" sx={{ textAlign: 'center' }}>
          Uploading Update
        </Heading>
        <Icon
          glyph={'close'}
          onClick={() => {
            props.onClose()
          }}
        />
      </Flex>
      <Box margin="15px 0" p={0}>
        {Object.keys(uploadStatus).map((key) => (
          <Flex p={0} sx={{ alignItems: 'center' }} key={key}>
            <Icon
              marginRight="4px"
              glyph={uploadStatus[key] ? 'check' : 'loading'}
            />
            <Text>| {key}</Text>
          </Flex>
        ))}
      </Box>
      <Button
        data-cy={uploadStatus.Complete ? 'view-research' : ''}
        disabled={!uploadStatus.Complete}
        variant={!uploadStatus.Complete ? 'disabled' : 'outline'}
        icon="arrow-forward"
        onClick={() => {
          navigate('/research/' + store.activeResearchItem!.slug)
          props.onClose()
        }}
      >
        View Research
      </Button>
    </Modal>
  )
})
