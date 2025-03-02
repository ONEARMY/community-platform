import { HeroBanner, Icon } from 'oa-components'
import { Box, Card, Flex, Heading, Text } from 'theme-ui'

const SignUpMessagePage = ({ email }) => {
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
              </Flex>
              <Text sx={{ textAlign: 'center', color: 'grey' }}>
                <p>
                  <strong>
                    Before you get stuck in we just need you to verify your
                    email address
                  </strong>
                  .<br />
                  We've sent a link to{' '}
                  <Text
                    sx={{
                      background:
                        'linear-gradient(0deg, #FFE2E1 60%, #FFF 40%)',
                      paddingX: 1,
                    }}
                  >
                    {email}
                  </Text>
                  . <br />
                </p>
                <p>
                  Please click it to confirm your account.
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
