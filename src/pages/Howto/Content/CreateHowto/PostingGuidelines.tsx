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
    <Text my={3}> 1. Titles are powerful. Choose wisely.</Text>
    <Text my={3}> 2. Use tags, that's how we stay organised.</Text>
    <Text my={3}> 3. Upload minimum 3 steps.</Text>
    <Text my={3}>4. Try to keep it short but informative.</Text>
    <Text my={3}> 5. For each steps try to use an image.</Text>
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
