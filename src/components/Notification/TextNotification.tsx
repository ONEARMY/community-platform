import * as React from 'react'
import Icon, { IGlyphs } from '../Icons'
import Text from '../Text'
import { Flex } from 'rebass'
import { FadeInOut } from '../Animations/FadeInOut'
import { getFriendlyMessage } from './messages'

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
}

export class TextNotification extends React.Component<
  ITextNotificationProps,
  IState
> {
  constructor(props: ITextNotificationProps) {
    super(props)
    this.state = { show: props.show }
  }
  static defaultProps: Partial<ITextNotificationProps> = {
    duration: 3000,
    type: 'info',
    text: '',
  }
  componentWillReceiveProps(
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

  triggerNotificationHide() {
    setTimeout(() => {
      this.setState({ show: false })
    }, this.props.duration)
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
