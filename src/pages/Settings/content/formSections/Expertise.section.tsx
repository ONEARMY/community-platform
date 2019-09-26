import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { Field } from 'react-final-form'
import { TagsSelectField } from 'src/components/Form/TagsSelect.field'

interface IProps {}
interface IState {
  checkedFocusValue?: string
}

export class ExpertiseSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Flex
        card
        mediumRadius
        bg={'white'}
        mt={5}
        flexWrap="wrap"
        flexDirection="column"
      >
        <Heading small p={4}>
          Expertise
        </Heading>
        <Box px={4}>
          <Text regular my={4}>
            What are you specialised in ? *
          </Text>
          <Flex wrap="nowrap">
            <Field
              name="expertise"
              component={TagsSelectField}
              category="profile-expertise"
            />
          </Flex>
        </Box>
      </Flex>
    )
  }
}
