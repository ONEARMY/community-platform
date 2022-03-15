import * as React from 'react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { inject, observer } from 'mobx-react'
import Heading from 'src/components/Heading'
import {Icon} from 'oa-components'
import { Modal } from 'src/components/Modal/Modal'
import { Button } from 'oa-components'
import { Flex } from 'rebass'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { RouteComponentProps } from 'react-router'

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
    return uploadStatus.Start ? (
      <Modal>
        <Flex justifyContent="space-between">
          <Heading small textAlign="center">
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
          {Object.keys(uploadStatus).map(key => (
            <Flex p={0} alignItems="center" key={key}>
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
    ) : null
  }
}
