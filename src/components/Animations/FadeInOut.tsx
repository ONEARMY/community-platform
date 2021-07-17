import * as React from 'react'
import { motion } from 'framer-motion'

interface IProps {
  show: boolean
}
interface IState {
  show: boolean
}

const AnimationContainer = (props?: React.ReactNode) => {
  return (
    <motion.div layout
      key={'animationContainer'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: 5, opacity: 0 }}>
      { props }
    </motion.div>
  )
}

export class FadeInOut extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { show: props.show }
  }

  /* eslint-disable @typescript-eslint/naming-convention*/
  UNSAFE_componentWillReceiveProps(props: IProps) {
    this.setState({ show: props.show })
  }

  render() {
      return this.state.show ? AnimationContainer(this.props.children) : AnimationContainer();
  }
}
