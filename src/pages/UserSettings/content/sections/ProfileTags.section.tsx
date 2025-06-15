import { useMemo } from 'react'
import { Field } from 'react-final-form'
import TagsSelectV2 from 'src/common/Tags/TagsSelectV2'
import { fields } from 'src/pages/UserSettings/labels'
import { COMPARISONS } from 'src/utils/comparisons'
import { getProfileTagsForTheme } from 'src/utils/getProfileTagsForTheme'
import { Flex, Text } from 'theme-ui'

import { FlexSectionContainer } from '../elements'

interface IProps {
  isMemberProfile: boolean
}

export const ProfileTags = ({ isMemberProfile }: IProps) => {
  const { description, title } = fields.tags

  const WrappedTagsSelect = ({ input, ...rest }) => {
    const profileTags = getProfileTagsForTheme(
      isMemberProfile ? 'member' : 'space',
    )

    return (
      <TagsSelectV2
        value={input.value}
        onChange={(tags) => input.onChange(tags)}
        tagsSource={profileTags}
        maxTotal={5}
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
