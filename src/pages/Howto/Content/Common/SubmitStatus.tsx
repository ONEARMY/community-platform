import * as React from 'react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { inject, observer } from 'mobx-react'
import Heading from 'src/components/Heading'
import Icon from 'src/components/Icons'
import { Flex } from 'rebass'
import Text from 'src/components/Text'
import { Box } from 'rebass'

interface IProps {}
interface IInjected {
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
    const status = this.injected.howtoStore.uploadStatus
    return (
      <>
        <Heading medium textAlign="center">
          Uploading How To
        </Heading>
        <Box margin="auto" p={0}>
          {Object.keys(status).map(key => (
            <Flex p={0} alignItems="center" key={key}>
              <Icon
                marginRight="4px"
                glyph={status[key] ? 'check' : 'loading'}
              />
              <Text>| {key}</Text>
            </Flex>
          ))}
        </Box>
      </>
    )
  }
}
