import * as React from 'react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { inject, observer } from 'mobx-react'
import Heading from 'src/components/Heading'
import Icon from 'src/components/Icons'
import { Modal } from 'src/components/Modal/Modal'
import { Button } from 'src/components/Button'
import { Flex } from 'rebass'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { RouteComponentProps } from 'react-router'

interface IProps extends RouteComponentProps<any> {}
interface IInjected extends IProps {
  howtoStore: HowtoStore
}

@inject('howtoStore')
@observer
export class HowToSubmitStatus extends React.Component<IProps> {
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
        <Heading medium textAlign="center">
          Uploading How To
        </Heading>
        <Box margin="auto" p={0}>
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
          mt={3}
          disabled={!uploadStatus.Complete}
          variant={!uploadStatus.Complete ? 'disabled' : 'outline'}
          icon="arrow-forward"
          onClick={() => {
            this.props.history.push(
              '/how-to/' + this.injected.howtoStore.activeHowto!.slug,
            )
          }}
        >
          View How-To
        </Button>
      </Modal>
    ) : null
  }
}
