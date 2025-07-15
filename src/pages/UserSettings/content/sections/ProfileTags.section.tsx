import { Field } from 'react-final-form'
import TagsSelectV2 from 'src/common/Tags/TagsSelectV2'
import { fields } from 'src/pages/UserSettings/labels'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { COMPARISONS } from 'src/utils/comparisons'
import { Flex, Text } from 'theme-ui'

import { FlexSectionContainer } from '../elements'

export const ProfileTags = () => {
  const { description, title } = fields.tags

  const { profile } = useProfileStore()

  return (
    <FlexSectionContainer>
      <Flex
        data-testid="ProfileTags"
        sx={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Text>{title}</Text>
        <Text variant="quiet" sx={{ fontSize: 2 }}>
          {description}
        </Text>
        <Field
          name="tags"
          component={(input) => (
            <TagsSelectV2
              value={input.value}
              onChange={(tags) => input.onChange(tags)}
              tagsSource={profile?.tags}
              maxTotal={5}
              isForm
            />
          )}
          isEqual={COMPARISONS.tags}
        />
      </Flex>
    </FlexSectionContainer>
  )
}
