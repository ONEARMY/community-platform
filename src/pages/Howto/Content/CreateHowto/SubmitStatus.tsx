import * as React from 'react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { inject, observer } from 'mobx-react'
import Heading from 'src/components/Heading'

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
          <div key={key}>
            <span>
              {key} : {status[key] ? 'complete' : 'pending'}
            </span>
          </div>
        ))}
      </>
    )
  }
}
