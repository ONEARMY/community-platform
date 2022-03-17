import { observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { Box, Flex } from 'theme-ui'
import { Button } from 'oa-components'
import Heading from 'src/components/Heading'
import {Icon} from 'oa-components'
import { Modal } from 'src/components/Modal/Modal'
import Text from 'src/components/Text'
import { useResearchStore } from 'src/stores/Research/research.store'

interface IProps extends RouteComponentProps<any> {
  onClose: () => void
}

export const ResearchSubmitStatus = observer((props: IProps) => {
  const store = useResearchStore()
  const uploadStatus = store.researchUploadStatus

  return uploadStatus.Start ? (
    <Modal>
      <Flex sx={{justifyContent: "space-between"}}>
        <Heading small sx={{textAlign:"center"}}>
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
        {Object.keys(uploadStatus).map(key => (
          <Flex p={0} sx={{alignItems: 'center'}} key={key}>
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
  ) : null
})

export const UpdateSubmitStatus = observer((props: IProps) => {
  const store = useResearchStore()
  const uploadStatus = store.updateUploadStatus

  return uploadStatus.Start ? (
    <Modal>
      <Flex sx={{justifyContent: "space-between"}}>
        <Heading small sx={{textAlign:"center"}}>
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
        {Object.keys(uploadStatus).map(key => (
          <Flex p={0} sx={{alignItems: 'center'}} key={key}>
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
  ) : null
})
