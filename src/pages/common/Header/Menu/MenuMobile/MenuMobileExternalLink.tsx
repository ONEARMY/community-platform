import { Component } from 'react'
import { Box } from 'theme-ui'
import { ExternalLink as Link } from 'oa-components'
import { observer, inject } from 'mobx-react'
import type { MobileMenuStore } from 'src/stores/MobileMenu/mobilemenu.store'

interface IProps {
  content: string
  href: string
}

interface IInjectedProps extends IProps {
  mobileMenuStore: MobileMenuStore
}

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
        <Box
          data-cy="mobile-menu-item"
          sx={{ paddingTop: 3, paddingBottom: 3 }}
        >
          <Link
            onClick={() => menu.toggleMobilePanel()}
            id={id}
            href={this.props.href}
            sx={{ color: 'silver', fontSize: 2 }}
          >
            {content}
          </Link>
        </Box>
      </>
    )
  }
}

export default MenuMobileExternalLink
