import errorImage from '../../assets/images/404error.png'
import { Flex, Image, Text } from 'theme-ui'
import { Link } from 'react-router-dom'
import type { FC } from 'react'

export const NotFoundPage: FC = () => (
  <Flex
    sx={{
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    }}
  >
    <Image
      src={errorImage}
      sx={{
        maxWidth: '45em',
        width: '98%',
        marginBottom: '2vw',
      }}
    />
    <Text data-test="NotFound: Heading">
      Nada, page not found 💩
      <br />
      Go to the <Link to="/">home page</Link>
    </Text>
  </Flex>
)
