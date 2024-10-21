import { Field } from 'react-final-form'
import TagsSelect from 'src/common/Tags/TagsSelect'
import { fields } from 'src/pages/UserSettings/labels'
import { userService } from 'src/services/user.service'
import { COMPARISONS } from 'src/utils/comparisons'
import { Flex, Heading, Text } from 'theme-ui'

import { FlexSectionContainer } from '../elements'

export const ProfileTags = () => {
  const { description, title } = fields.tags

  return (
    <FlexSectionContainer>
      <Flex
        data-testid="ProfileTags"
        sx={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Heading as="h2">{title}</Heading>
        <Text variant="quiet">{description}</Text>
        <Field
          name="tags"
          component={WrappedTagsSelect}
          isEqual={COMPARISONS.tags}
        />
      </Flex>
    </FlexSectionContainer>
  )
}

const WrappedTagsSelect = ({ input, ...rest }) => {
  const { getProfileTags } = userService
  const profileTags = getProfileTags()

  return (
    <TagsSelect
      value={input.value}
      onChange={(tags) => input.onChange(tags)}
      tagsSource={profileTags}
      {...rest}
    />
  )
}
