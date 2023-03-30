import styled from '@emotion/styled'
import { Component } from 'react'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import { Box } from 'theme-ui'
import { observer, inject } from 'mobx-react'
import type { MobileMenuStore } from 'src/stores/MobileMenu/mobilemenu.store'
import { Link } from 'react-router-dom'

interface IProps {
  content: string
  href: string
}

interface IInjectedProps extends IProps {
  mobileMenuStore: MobileMenuStore
}

const PanelItem = styled(Box)`
  padding: ${theme.space[3]}px 0px;
`
@inject('mobileMenuStore')
@observer
export class MenuMobileExternalLink extends Component<IProps> {
  // eslint-disable-next-line
  constructor(props: IProps) {
    super(props)
  }

  get injected() {
    return this.props as IInjectedProps
  }

  render() {
    const menu = this.injected.mobileMenuStore
    const content = this.props.content
    const id = content.toLowerCase().replace(' ', '-')
    return (
      <>
        <PanelItem data-cy="mobile-menu-item">
          <Link
            onClick={() => menu.toggleMobilePanel()}
            id={id}
            to={this.props.href}
            style={{ color: theme.colors.silver, fontSize: 2 }}
          >
            {content}
          </Link>
        </PanelItem>
      </>
    )
  }
}

export default MenuMobileExternalLink
