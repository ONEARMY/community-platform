import { ExternalLink, HeroBanner, Icon } from 'oa-components'
import { Box, Card, Flex, Heading, Text } from 'theme-ui'

const SignUpMessagePage = ({ email }) => {
  const linkStyle = {
    color: 'grey',
    textDecoration: 'underline',
    ':hover': {
      textDecoration: 'none',
    },
  }
  return (
    <Flex
      sx={{
        bg: 'inherit',
        px: 2,
        width: '100%',
        maxWidth: '620px',
        mx: 'auto',
        mt: [5, 10],
        mb: 3,
      }}
    >
      <Flex sx={{ flexDirection: 'column', width: '100%' }}>
        <HeroBanner type="email" />
        <Flex
          sx={{
            flexDirection: 'column',
            transform: 'translateY(-50px)',
          }}
        >
          <Box
            sx={{
              alignSelf: 'center',
              border: '2px solid #000',
              borderRadius: 25,
              zIndex: 3,
            }}
          >
            <Icon
              glyph="star-active"
              size={60}
              sx={{
                backgroundColor: '#ffedd6',
                border: '5px solid #fff',
                borderRadius: 25,
                padding: 2,
              }}
            />
          </Box>
          <Card sx={{ borderRadius: 3, transform: 'translateY(-25px)' }}>
            <Flex
              sx={{
                padding: 4,
                paddingTop: 6,
                gap: 2,
                flexDirection: 'column',
              }}
            >
              <Flex
                sx={{
                  gap: 1,
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Heading>Yay! Welcome to One Army!</Heading>

                <Heading variant="small">
                  (This means you've joined the{' '}
                  <ExternalLink
                    href="https://www.fixing.fashion/"
                    sx={linkStyle}
                  >
                    Fixing Fashion
                  </ExternalLink>
                  ,{' '}
                  <ExternalLink
                    href="https://www.preciousplastic.com/"
                    sx={linkStyle}
                  >
                    Precious Plastic
                  </ExternalLink>{' '}
                  and{' '}
                  <ExternalLink
                    href="https://www.projectkamp.com/"
                    sx={linkStyle}
                  >
                    Project Kamp
                  </ExternalLink>{' '}
                  communities)
                </Heading>
              </Flex>
              <Text sx={{ textAlign: 'center', color: 'grey' }}>
                <p>
                  <strong>
                    Before you get stuck in we just need you to verify your
                    email address
                  </strong>
                  .<br />
                  We've sent a link to <strong>{email}</strong>. Please click it
                  to confirm your account.
                  <br />
                  After you've done that, you can login.
                </p>
              </Text>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SignUpMessagePage
