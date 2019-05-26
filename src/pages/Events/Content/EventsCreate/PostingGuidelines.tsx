import * as React from 'react'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Link } from 'rebass'

// TODO : create a component to avoid duplicate with how-to's guidelines

export const PostingGuidelines = () => (
  <BoxContainer bg="white" p={3}>
    <Heading small bold>
      Event Posting Guidelines
    </Heading>
    <Text my={3}> 1. Titles are powerful. Choose wisely.</Text>
    <Text my={3}> 2. Use tags, that's how we stay organised.</Text>
    <Text small>
      If unsure please read our posting policy as well as our{' '}
      <Link
        color={'black'}
        href="https://github.com/OneArmyWorld/onearmy/blob/master/CODE_OF_CONDUCT.md"
        target="_blank"
      >
        {' '}
        <b>code of conduct</b>
      </Link>
      .
    </Text>
  </BoxContainer>
)
