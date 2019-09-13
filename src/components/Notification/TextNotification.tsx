import * as React from 'react'
import Icon, { IGlyphs } from '../Icons'
import Text from '../Text'
import { Flex } from 'rebass'
import { FadeInOut } from '../Animations/FadeInOut'

/*  
    This component displays a simple text inline as a notification. 
    By default the message hides after a few seconds
*/
interface IState {
  show: boolean
}
interface IProps {
  text: string
  show: boolean
  duration?: number
  icon?: keyof IGlyphs
}

export class TextNotification extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { show: props.show }
  }
  static defaultProps: Partial<IProps> = {
    duration: 2000,
  }
  componentWillReceiveProps(next: IProps, prev: IProps) {
    if (next.show && !prev.show) {
      this.setState({ show: true })
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
    const { text, icon } = this.props
    return (
      <FadeInOut show={this.state.show}>
        <Flex p={0} mt={2} alignItems="center" bg="none">
          {icon && <Icon glyph={icon} />}
          <Text>{text}</Text>
        </Flex>
      </FadeInOut>
    )
  }
}
