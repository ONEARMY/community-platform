import styled from 'styled-components'
import { Component } from 'react'
import { Box } from 'rebass/styled-components'
import { LinkTargetBlank } from 'src/components/Links/LinkTargetBlank/LinkTargetBlank'
import { observer, inject } from 'mobx-react'
import { MobileMenuStore } from 'src/stores/MobileMenu/mobilemenu.store'

interface IProps {
  content: string
  href: string
}

interface IInjectedProps extends IProps {
  mobileMenuStore: MobileMenuStore
  themeStore: any; //FIXME: thisislawatts - declare a type
}

const PanelItem = styled(Box)`
  padding: ${props => props.theme.space[3]}px 0px;
`
@inject('mobileMenuStore', 'themeStore')
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
    const theme = this.injected.themeStore.currentTheme.styles
    const content = this.props.content
    const id = content.toLowerCase().replace(' ', '-')
    return (
      <>
        <PanelItem data-cy="mobile-menu-item">
          <LinkTargetBlank
            onClick={() => menu.toggleMobilePanel()}
            id={id}
            href={this.props.href}
            style={{ color: theme.colors.silver, fontSize: theme.fontSizes[2] }}
          >
            {content}
          </LinkTargetBlank>
        </PanelItem>
      </>
    )
  }
}

export default MenuMobileExternalLink
