import Main from 'src/pages/common/Layout/Main'
import { Card, Flex, Heading, Text } from 'theme-ui'

export async function loader() {
  return null
}

export default function Index() {
  return (
    <Main style={{ flex: 1 }}>
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
          <Flex
            sx={{
              flexDirection: 'column',
            }}
          >
            <Card sx={{ borderRadius: 3 }}>
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
                  <Heading>Insufficient Permissions</Heading>
                </Flex>
                <Text sx={{ textAlign: 'center', color: 'grey' }}>
                  <p>
                    <strong>
                      Please contact an admin for additional permissions
                    </strong>
                  </p>
                </Text>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </Main>
  )
}
