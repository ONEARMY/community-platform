import * as React from 'react'
import { RouteComponentProps } from 'react-router'

/*************************************************************************************
 *  Embed an Iframe
 *
 *  NOTE - it is designed to only set the src on initial mount (not on prop change).
 *  This is so that postmessages can be used to communicate nav changes from the iframe
 *  up to the parent component, update the parent url and avoid double-refresh of the
 *  page.
 *************************************************************************************/

interface IProps extends RouteComponentProps {
  src: string
}
interface IState {
  src: string
}

export class ExternalEmbed extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      src: this.props.src,
    }
  }

  componentDidMount() {
    // TODO - possible compatibility fallback for addEventListener (IE8)
    // Example: https://davidwalsh.name/window-iframe
    window.addEventListener('message', this.handlePostmessageFromIframe, false)
  }
  componentWillUnmount() {
    window.removeEventListener(
      'message',
      this.handlePostmessageFromIframe,
      false,
    )
  }

  /**
   * Custom method to allow communication from Iframe to parent via postmessage
   * Currently configured to receive the pathname of the onearmy github academy page
   * and use to update the relative url on the parent router.
   */
  handlePostmessageFromIframe = (e: MessageEvent) => {
    // only allow messages from specific sites (academy dev and live)
    if (
      ['http://localhost:3001', 'https://onearmy.github.io'].includes(e.origin)
    ) {
      if (e.data && e.data.pathname) {
        this.props.history.push(e.data.pathname)
      }
    }
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          height: '100%',
        }}
      >
        <iframe
          src={this.state.src}
          style={{
            border: 0,
            height: '100%',
            width: '100%',
          }}
        />
      </div>
    )
  }
}
