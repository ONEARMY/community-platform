import * as React from 'react'
import type { IGlyphs } from 'oa-components'
import { Icon } from 'oa-components'
import Text from '../Text'
import { Flex } from 'rebass'
import { FadeInOut } from '../Animations/FadeInOut'
import { getFriendlyMessage } from 'oa-shared'

/*  
    This component displays a simple text inline as a notification. 
    By default the message hides after a few seconds
*/
interface IState {
  show: boolean
  friendlyMessage?: string
}
// export interface to make easier to use by other componetns
export interface ITextNotificationProps {
  show: boolean
  text?: string
  type?: 'error' | 'confirmation' | 'warning' | 'info'
  duration?: number
  icon?: keyof IGlyphs
  hideNotificationCb?: () => void
}

export class TextNotification extends React.Component<
  ITextNotificationProps,
  IState
> {
  timerHandle: number
  constructor(props: ITextNotificationProps) {
    super(props)
    this.state = { show: props.show }
  }
  static defaultProps: Partial<ITextNotificationProps> = {
    duration: 3000,
    type: 'info',
    text: '',
  }
  /* eslint-disable @typescript-eslint/naming-convention*/
  UNSAFE_componentWillReceiveProps(
    next: ITextNotificationProps,
    prev: ITextNotificationProps,
  ) {
    if (next.show && !prev.show) {
      this.setState({
        show: true,
        friendlyMessage: getFriendlyMessage(next.text!),
      })
      this.triggerNotificationHide()
    }
  }

  componentDidMount() {
    this.triggerNotificationHide()
  }
  // in case component unmounted before hide timeout trigger,
  // clear the timeout now to prevent state update on unmounted component
  componentWillUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle)
      this.timerHandle = 0
    }
  }

  triggerNotificationHide() {
    clearTimeout(this.timerHandle)
    this.timerHandle = window.setTimeout(() => {
      if (this.timerHandle && this.timerHandle > 0) {
        this.setState({ show: false })
        this.timerHandle = 0
      }
    }, this.props.duration)
    if (this.props.hideNotificationCb) {
      this.props.hideNotificationCb()
    }
  }

  render() {
    const { icon, type } = this.props
    const { friendlyMessage, show } = this.state
    return (
      <FadeInOut show={show}>
        <Flex p={0} mt={2} alignItems="center" bg="none">
          {icon && <Icon glyph={icon} />}
          <Text data-cy={'notification-' + type}>{friendlyMessage}</Text>
        </Flex>
      </FadeInOut>
    )
  }
}
