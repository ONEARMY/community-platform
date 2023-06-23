import { Component } from 'react'
import { Box, Flex } from 'theme-ui'
import ProfileButtonItem from './ProfileButtonItem'

interface IProps {
  isMobile?: boolean
}

export class ProfileButtons extends Component<IProps> {
  render() {
    const _commonMobileBtnStyle = {
      fontSize: 1,
      justifyContent: 'center',
      textAlign: 'center',
      width: '100%',
    }
    return (
      <>
        {this.props.isMobile ? (
          <Flex
            sx={{
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                pt: 1,
                pb: 2,
                display: 'block',
              }}
            >
              <ProfileButtonItem
                link={'/sign-in'}
                text="Login"
                variant="secondary"
                sx={{
                  ..._commonMobileBtnStyle,
                  fontWeight: 'bold',
                  marginRight: 2,
                  marginBottom: 2,
                }}
                isMobile={true}
              />
              <ProfileButtonItem
                link={'/sign-up'}
                text="Join"
                variant="outline"
                isMobile={true}
                sx={{
                  ..._commonMobileBtnStyle,
                }}
              />
            </Box>
          </Flex>
        ) : (
          <>
            <ProfileButtonItem
              link={'/sign-in'}
              text="Login"
              variant="secondary"
              sx={{
                fontWeight: 'bold',
                marginRight: 2,
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
