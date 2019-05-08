import * as React from 'react'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Link } from 'rebass'

export const PostingGuidelines = () => (
  <BoxContainer bg="white" p={3}>
    <Heading small bold>
      How-to Posting Guidelines
    </Heading>
    <Text my={3}> 1. You think water moves fast ?</Text>
    <Text my={3}> 2. You should see ice.</Text>
    <Text my={3}> 3. It moves like it has a mind.</Text>
    <Text my={3}>
      {' '}
      4. Like it knows it killed the world once and got a taste for murder.
    </Text>
    <Text my={3}> 5. After the avalanche, it took us a week.</Text>
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
