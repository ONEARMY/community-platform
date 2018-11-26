import * as React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { PlatformStore } from 'src/stores/Platform/platform.store'
import { inject, observer } from 'mobx-react'

/* Simple component to listen to store updates to service worker and present a
snackbar/toast message to inform the user to reload their browser to see changes 
bind to isOpen in parent to toggle 
*/
interface IState {
  forceClose: boolean
}

interface IProps {
  platformStore?: PlatformStore
}

interface InjectedProps extends IProps {
  platformStore: PlatformStore
}

@inject('platformStore')
@observer
export class SWUpdateNotification extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { forceClose: false }
  }
  get injected() {
    return this.props as InjectedProps
  }

  public handleClose = () => {
    this.setState({ forceClose: true })
  }

  public render() {
    return (
      <Snackbar
        action={[
          <Button
            key="reload"
            color="secondary"
            size="small"
            onClick={() => location.reload()}
          >
            Reload
          </Button>,
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
        message={<span id="message-id">New version available</span>}
        open={
          this.state.forceClose
            ? false
            : this.injected.platformStore.serviceWorkerStatus === 'updated'
            ? true
            : false
        }
      />
    )
  }
}
