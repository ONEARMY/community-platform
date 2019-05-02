import * as React from 'react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { inject, observer } from 'mobx-react'
import Heading from 'src/components/Heading'
import Icon from 'src/components/Icons'
import { FlexContainer } from 'src/components/Layout/FlexContainer'
import Text from 'src/components/Text'

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
        <Heading medium>Uploading How To</Heading>
        {Object.keys(status).map(key => (
          <FlexContainer justifyContent="center" key={key}>
            <Icon marginRight="4px" glyph={status[key] ? 'check' : 'loading'} />
            <Text>| {key}</Text>
          </FlexContainer>
        ))}
      </>
    )
  }
}
