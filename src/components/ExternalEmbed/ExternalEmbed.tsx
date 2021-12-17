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
  targetOrigin: string
}

class ExternalEmbed extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)

    const url = new URL(this.props.src)

    this.state = {
      src: this.props.src,
      targetOrigin: url.protocol + '//' + url.hostname,
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
   */
  handlePostmessageFromIframe = (e: MessageEvent) => {
    console.log({ eOrigin: e.origin, src: this.props.src })
    // only allow messages from specific sites (academy dev and live)
    console.log(e.data.pathname)
    if ([this.state.targetOrigin].includes(e.origin)) {
      // communicate url changes, update navbar
      if (e.data && e.data.pathname) {
        this.props.history.push(e.data.pathname)
      }
      // communicate a href link clicks, open link in new tab
      if (e.data && e.data.linkClick) {
        window.open(e.data.linkClick, '_blank')
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
          title="precious plastic academy"
        />
      </div>
    )
  }
}
export default ExternalEmbed
