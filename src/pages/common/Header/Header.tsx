import React from 'react'
import { CommunityHeader } from './CommunityHeader/CommunityHeader'
import { PublicHeader } from './PublicHeader/PublicHeader'
import AppBar from '@material-ui/core/AppBar'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'

interface IProps {
  variant: 'community' | 'public'
  title: string
  description: string
}

// injected properties - See https://medium.com/@prashaantt/strongly-typing-injected-react-props-635a6828acaf
// typescript doesn't natively understand that the store is available (injected by mobx), so use additional getter and typecasting
interface InjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
// for re-render on userStore changes using observer decorator
@observer
export class Header extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  get injected() {
    return this.props as InjectedProps
  }

  render() {
    const { title, description } = this.props
    return (
      <div id="header">
        <AppBar position="static">
          {this.props.variant === 'community' ? (
            <CommunityHeader {...{ title, description }} />
          ) : (
            <PublicHeader />
          )}
        </AppBar>
      </div>
    )
  }
}

export default Header
