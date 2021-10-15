import { Component } from 'react'
import styled from 'styled-components'
import { Box } from 'rebass/styled-components'
import ProfileButtonItem from './ProfileButtonItem'
import { inject, observer } from 'mobx-react'
import type { ThemeStore } from 'src/stores/Theme/theme.store'

interface IProps {
  isMobile?: boolean
}

const PanelButton = styled(Box)`
  padding-top: ${props => props.theme.space[1]}px;
  padding-bottom: ${props => props.theme.space[2]}px;
`
@inject('themeStore')
@observer
export class ProfileButtons extends Component<IProps> {
  constructor(props: any) {
    super(props)
  }

  get injected() {
    return this.props as {
      themeStore: ThemeStore
    }
  }

  render() {
    const theme = this.injected.themeStore?.currentTheme.styles
    return (
      <>
        {this.props.isMobile ? (
          <>
            <PanelButton>
              <ProfileButtonItem
                link={'/sign-in'}
                text="Login"
                variant="secondary"
                style={{
                  fontWeight: 'bold',
                  marginRight: 2,
                  display: 'inline-block',
                  width: 100,
                  fontSize: theme.fontSizes[1],
                }}
                isMobile={true}
              />
            </PanelButton>
            <PanelButton>
              <ProfileButtonItem
                link={'/sign-up'}
                text="Join"
                variant="colorful"
                isMobile={true}
                style={{
                  display: 'inline-block',
                  width: 100,
                  fontSize: theme.fontSizes[1],
                }}
              />
            </PanelButton>
          </>
        ) : (
          <>
            <ProfileButtonItem
              link={'/sign-in'}
              text="Login"
              variant="secondary"
              style={{
                fontWeight: 'bold',
                marginRight: theme.radii[2],
                fontSize: theme.fontSizes[2],
              }}
            />
            <ProfileButtonItem
              link={'/sign-up'}
              text="Join"
              variant="colorful"
              style={{ fontSize: theme.fontSizes[2] }}
            />
          </>
        )}
      </>
    )
  }
}

export default ProfileButtons
