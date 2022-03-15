import { Component } from 'react';
import theme from 'src/themes/styled.theme'
import styled from '@emotion/styled'
import { Box } from 'rebass'
import ProfileButtonItem from './ProfileButtonItem'

interface IProps {
  isMobile?: boolean
}

const PanelButton = styled(Box)`
  padding-top: ${theme.space[1]}px;
  padding-bottom: ${theme.space[2]}px;
`

export class ProfileButtons extends Component<IProps> {
  render() {
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
