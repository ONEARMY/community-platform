import { Component } from 'react'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import styled from '@emotion/styled'
import { Box, Flex } from 'theme-ui'
import ProfileButtonItem from './ProfileButtonItem'

interface IProps {
  isMobile?: boolean
}

const PanelButton = styled(Box)`
  padding-top: ${theme.space[1]}px;
  padding-bottom: ${theme.space[2]}px;
  display: block;
`

export class ProfileButtons extends Component<IProps> {
  render() {
    return (
      <>
        {this.props.isMobile ? (
          <Flex
            sx={{
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <PanelButton>
              <ProfileButtonItem
                link={'/sign-in'}
                text="Login"
                variant="secondary"
                sx={{
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginRight: '10px',
                  display: 'block',
                  width: '100%',
                  fontSize: '12px',
                  textAlign: 'center',
                  marginBottom: '10px',
                }}
                isMobile={true}
              />
              <ProfileButtonItem
                link={'/sign-up'}
                text="Join"
                variant="outline"
                isMobile={true}
                sx={{
                  fontSize: '12px',
                  justifyContent: 'center',
                  textAlign: 'center',
                  width: '100%',
                }}
              />
            </PanelButton>
          </Flex>
        ) : (
          <>
            <ProfileButtonItem
              link={'/sign-in'}
              text="Login"
              variant="secondary"
              sx={{
                fontWeight: 'bold',
                marginRight: '10px',
                fontSize: 2,
              }}
            />
            <ProfileButtonItem
              link={'/sign-up'}
              text="Join"
              variant="outline"
              sx={{ fontSize: 2 }}
            />
          </>
        )}
      </>
    )
  }
}

export default ProfileButtons
