import { inject, observer } from 'mobx-react'
import { Button, Icon, Modal } from 'oa-components'
import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import { Box, Flex, Heading, Text } from 'theme-ui'

interface IProps extends RouteComponentProps<any> {
  onClose: () => void
}
interface IInjected extends IProps {
  howtoStore: HowtoStore
}

@inject('howtoStore')
@observer
export class HowToSubmitStatus extends React.Component<IProps> {
  // eslint-disable-next-line
  constructor(props: IProps) {
    super(props)
  }

  get injected() {
    return this.props as IInjected
  }

  render() {
    const uploadStatus = this.injected.howtoStore.uploadStatus
    return (
      <Modal isOpen={!!uploadStatus.Start}>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small" sx={{ textAlign: 'center' }}>
            Uploading How To
          </Heading>
          <Icon
            glyph={'close'}
            onClick={() => {
              this.props.onClose()
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
          data-cy={uploadStatus.Complete ? 'view-howto' : ''}
          disabled={!uploadStatus.Complete}
          variant={!uploadStatus.Complete ? 'disabled' : 'outline'}
          icon="arrow-forward"
          onClick={() => {
            this.props.history.push(
              '/how-to/' + this.injected.howtoStore.activeHowto!.slug,
            )
            this.props.onClose()
          }}
        >
          View How-To
        </Button>
      </Modal>
    )
  }
}
