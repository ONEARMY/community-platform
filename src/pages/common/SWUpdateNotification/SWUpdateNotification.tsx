import * as React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import { PlatformStore } from 'src/stores/Platform/platform.store'
import { inject, observer } from 'mobx-react'

/* Simple component to listen to store updates to service worker and present a
snackbar/toast message to inform the user to reload their browser to see changes 
bind to isOpen in parent to toggle.
NOTE - we do not provide a dismiss button as lazy loaded routes will fail to load if not updated
*/

interface IProps {
  platformStore?: PlatformStore
}
interface IState {
  disabled: boolean
}

interface InjectedProps extends IProps {
  platformStore: PlatformStore
}

@inject('platformStore')
@observer
export class SWUpdateNotification extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { disabled: false }
  }
  get injected() {
    return this.props as InjectedProps
  }

  public activateServiceWorkder() {
    const { registration } = this.injected.platformStore
    if (!registration.waiting) {
      // Just to ensure registration.waiting is available before
      // calling postMessage()
      return
    }
    this.setState({ disabled: true })
    registration.waiting.postMessage('skipWaiting')
  }

  public render() {
    return (
      <Snackbar
        action={[
          <Button
            key="reload"
            color="secondary"
            size="small"
            onClick={() => this.activateServiceWorkder()}
            disabled={this.state.disabled}
          >
            {this.state.disabled ? 'Updating' : 'Update'}
          </Button>,
        ]}
        message={<span id="message-id">New version available</span>}
        open={this.injected.platformStore.serviceWorkerStatus === 'updated'}
      />
    )
  }
}
