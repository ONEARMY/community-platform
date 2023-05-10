import { observer } from 'mobx-react'
import { Button, Icon, Modal } from 'oa-components'
import type { RouteComponentProps } from 'react-router'
import { useResearchStore } from 'src/stores/Research/research.store'
import { Box, Flex, Heading, Text } from 'theme-ui'

interface IProps extends RouteComponentProps<any> {
  onClose: () => void
}

export const ResearchSubmitStatus = observer((props: IProps) => {
  const store = useResearchStore()
  const uploadStatus = store.researchUploadStatus

  return (
    <Modal isOpen={!!uploadStatus.Start}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading variant="small" sx={{ textAlign: 'center' }}>
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
          props.history.push('/research/' + store.activeResearchItem!.slug)
          props.onClose()
        }}
      >
        View Research
      </Button>
    </Modal>
  )
})

export const UpdateSubmitStatus = observer((props: IProps) => {
  const store = useResearchStore()
  const uploadStatus = store.updateUploadStatus

  return (
    <Modal isOpen={!!uploadStatus.Start}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading variant="small" sx={{ textAlign: 'center' }}>
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
          props.history.push('/research/' + store.activeResearchItem!.slug)
          props.onClose()
        }}
      >
        View Research
      </Button>
    </Modal>
  )
})
