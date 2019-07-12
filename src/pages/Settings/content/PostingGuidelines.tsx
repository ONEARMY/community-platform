import * as React from 'react'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Link } from 'rebass'

// TODO Make a PostingGuidelines component that take the related page as prop

export const PostingGuidelines = () => (
  <BoxContainer bg="white" p={3}>
    <Heading small bold>
      Guidelines for an Individual Profile
    </Heading>
    <Text my={3}> 1. You can pin your Workspace or a Collection Point.</Text>
    <Text my={3}>
      {' '}
      2. Map pins will link to your profile so please make sure it’s updated.
    </Text>
    <Text my={3}>
      {' '}
      3. If you’re a member update your profile location to be added to the map.
    </Text>
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
