import { useMemo } from 'react'
import { Field } from 'react-final-form'
import TagsSelect from 'src/common/Tags/TagsSelect'
import { fields } from 'src/pages/UserSettings/labels'
import { userService } from 'src/services/user.service'
import { COMPARISONS } from 'src/utils/comparisons'
import { Flex, Text } from 'theme-ui'

import { FlexSectionContainer } from '../elements'

interface IProps {
  isMemberProfile: boolean
}

export const ProfileTags = ({ isMemberProfile }: IProps) => {
  const { description, title } = fields.tags

  const WrappedTagsSelect = ({ input, ...rest }) => {
    const { getProfileTags } = userService
    const profileTags = getProfileTags(isMemberProfile ? 'member' : 'space')

    return (
      <TagsSelect
        value={input.value}
        onChange={(tags) => input.onChange(tags)}
        tagsSource={profileTags}
        isForm
        {...rest}
      />
    )
  }

  const memoWrappedTagsSelect = useMemo(
    () => WrappedTagsSelect,
    [isMemberProfile],
  )

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
          component={memoWrappedTagsSelect}
          isEqual={COMPARISONS.tags}
        />
      </Flex>
    </FlexSectionContainer>
  )
}
