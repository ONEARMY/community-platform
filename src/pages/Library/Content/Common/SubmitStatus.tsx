import { useNavigate } from '@remix-run/react'
import { observer } from 'mobx-react'
import { Button, Icon, Modal } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Box, Flex, Heading, Text } from 'theme-ui'

import { buttons, headings } from '../../labels'

interface IProps {
  slug: string
  onClose: () => void
}

const HowToSubmitStatus = observer((props: IProps) => {
  const navigate = useNavigate()
  const { howtoStore } = useCommonStores().stores

  const uploadStatus = howtoStore.uploadStatus
  return (
    <Modal isOpen={!!uploadStatus.Start}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading as="p" variant="small" sx={{ textAlign: 'center' }}>
          {headings.uploading}
        </Heading>
        <Icon
          data-cy="close-upload-status"
          glyph="close"
          onClick={() => props.onClose()}
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
        type="button"
        data-cy={uploadStatus.Complete ? 'view-howto' : ''}
        disabled={!uploadStatus.Complete}
        variant={!uploadStatus.Complete ? 'disabled' : 'outline'}
        icon="arrow-forward"
        onClick={() => {
          navigate('/library/' + props.slug)
          props.onClose()
        }}
      >
        {buttons.view}
      </Button>
    </Modal>
  )
})

export { HowToSubmitStatus }
